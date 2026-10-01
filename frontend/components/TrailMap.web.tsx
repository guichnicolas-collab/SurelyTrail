import { useCallback, useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { router, useGlobalSearchParams } from "expo-router";
import {
  MapContainer,
  Polyline,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { LatLngExpression, Polyline as LeafletPolyline } from "leaflet";

import "leaflet/dist/leaflet.css";
import SlideIn from "./SlideIn";

import {
  SELECTED_TRAIL_COLOR,
  SELECTED_TRAIL_WIDTH,
  TRAIL_COLOR,
  TRAIL_WIDTH,
  WEB_TILE_URL,
} from "../constants/map";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

type TrailPolyline = LeafletPolyline & { trailName?: string };

export type TrailData = {
  bounds: { north: number; south: number; east: number; west: number };
  createdAt: string;
  description: string;
  difficulty: string;
  distance: number;
  elevationGain: number;
  endPoint: { type: string; coordinates: number[] };
  estimatedTime: number;
  location: { type: string; coordinates: [number, number][] };
  name: string;
  source: string;
  startPoint: { type: string; coordinates: number[] };
  tags: string[];
  __v: number;
  _id: string;
};

function toLeafletPositions(coords: [number, number][]): LatLngExpression[] {
  return coords.map(([lng, lat]) => [lat, lng]);
}

function MapEventHandler({
  onDeselect,
  onMapChange,
}: {
  onDeselect: (name: string) => void;
  onMapChange: (data: TrailData[]) => void;
}) {
  const map = useMap();
  const params = useGlobalSearchParams<{
    swlng: string;
    swlat: string;
    nelng: string;
    nelat: string;
  }>();

  const queryTrails = useCallback(() => {
    const bounds = map.getBounds();

    router.setParams({
      swlat: bounds.getSouth(),
      swlng: bounds.getWest(),
      nelat: bounds.getNorth(),
      nelng: bounds.getEast(),
    });

    fetch(
      `${API_URL}/queryTrails?swlat=${bounds.getSouth()}&swlng=${bounds.getWest()}&nelat=${bounds.getNorth()}&nelng=${bounds.getEast()}`,
    )
      .then(async (response) => {
        return response.json();
      })
      .then((data) => {
        onMapChange(data);
      });
  }, [map, onMapChange]);

  useEffect(() => {
    queryTrails();
  }, [map, onMapChange, queryTrails]);

  useEffect(() => {
    if (params.swlat && params.swlng && params.nelat && params.nelng) {
      map.fitBounds([
        [+params.swlat, +params.swlng],
        [+params.nelat, +params.nelng],
      ]);
    }
  }, [map, params.nelat, params.nelng, params.swlat, params.swlng]);

  useMapEvents({
    popupclose(event) {
      const source = (event.popup as { _source?: TrailPolyline })._source;
      if (source?.trailName) {
        onDeselect(source.trailName);
      }
    },
    moveend() {
      queryTrails();
    },
    zoom() {
      queryTrails();
    },
    resize() {
      queryTrails();
    },
  });

  return null;
}

type TrailLineProps = {
  name: string;
  positions: LatLngExpression[];
  isSelected: boolean;
  onSelect: (name: string) => void;
};

function TrailLine({ name, positions, isSelected, onSelect }: TrailLineProps) {
  const bindTrailLayer = useCallback(
    (layer: LeafletPolyline | null) => {
      if (layer) {
        (layer as TrailPolyline).trailName = name;
      }
    },
    [name],
  );

  return (
    <Polyline
      ref={bindTrailLayer}
      positions={positions}
      pathOptions={{
        color: isSelected ? SELECTED_TRAIL_COLOR : TRAIL_COLOR,
        weight: isSelected ? SELECTED_TRAIL_WIDTH : TRAIL_WIDTH,
        opacity: 1,
      }}
      eventHandlers={{
        click: () => onSelect(name),
      }}
    >
      {/* <Popup closeOnClick={false} closeOnEscapeKey={false}>
        <strong>{name}</strong>
      </Popup> */}
    </Polyline>
  );
}

export default function TrailMap() {
  const [trailData, setTrailData] = useState<TrailData[] | null>(null);
  const params = useGlobalSearchParams<{ trail?: string }>();
  const [selectedTrail, setSelectedTrail] = useState<TrailData | null>(() => {
    return trailData?.find((t) => t._id === params.trail) ?? null;
  });

  const handleSelect = useCallback(
    (id: string) => {
      const match = trailData?.find((t) => t._id === id);
      if (!match) return;
      setSelectedTrail(match);
      router.setParams({ trail: id });
    },
    [trailData],
  );

  const handleDeselect = useCallback((_id: string) => {
    setSelectedTrail(null);
    router.setParams({ trail: undefined });
  }, []);

  const onMapChange = useCallback(
    (data: TrailData[]) => {
      setTrailData(data);
      setSelectedTrail(data?.find((t) => t._id === params.trail) ?? null);
    },
    [params.trail],
  );

  const center = useCallback(() => {
    const centerPoint: [number, number] | undefined =
      selectedTrail?.location.coordinates[
        Math.floor(selectedTrail.location.coordinates.length / 2)
      ];
    if (centerPoint) {
      const west = centerPoint[0] - 0.0125;
      const east = centerPoint[0] + 0.0125;
      const north = centerPoint[1] + 0.0375;
      const south = centerPoint[1] - 0.0375;
      router.setParams({
        swlat: south,
        swlng: west,
        nelat: north,
        nelng: east,
      });
    }
  }, [selectedTrail]);

  return (
    <View style={styles.container}>
      <MapContainer
        center={[39.09, -120.03]}
        zoom={10}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={WEB_TILE_URL}
          maxZoom={19}
        />
        <MapEventHandler
          onDeselect={handleDeselect}
          onMapChange={onMapChange}
        />
        {trailData?.map((trail) => {
          const id = trail._id;
          return (
            <TrailLine
              key={id}
              name={id}
              positions={toLeafletPositions(trail.location.coordinates)}
              isSelected={id === selectedTrail?._id}
              onSelect={handleSelect}
            />
          );
        })}
      </MapContainer>
      <SlideIn
        selectedTrail={selectedTrail}
        displayedTrails={trailData}
        handleDeselect={handleDeselect}
        handleSelect={handleSelect}
        center={center}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
