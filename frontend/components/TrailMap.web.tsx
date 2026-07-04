import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import type { LatLngExpression, Polyline as LeafletPolyline } from "leaflet";

import "leaflet/dist/leaflet.css";

import {
  SELECTED_TRAIL_COLOR,
  SELECTED_TRAIL_WIDTH,
  TRAIL_COLOR,
  TRAIL_WIDTH,
  WEB_TILE_SUBDOMAINS,
  WEB_TILE_URL,
} from "../constants/map";
import trails from "../trails.json";
import type { TrailCollection } from "../types/geojson";

const geojson = trails as TrailCollection;

type TrailPolyline = LeafletPolyline & { trailName?: string };

function toLeafletPositions(coords: [number, number][]): LatLngExpression[] {
  return coords.map(([lng, lat]) => [lat, lng]);
}

function PopupCloseHandler({ onDeselect }: { onDeselect: (name: string) => void }) {
  useMapEvents({
    popupclose(event) {
      const source = (event.popup as { _source?: TrailPolyline })._source;
      if (source?.trailName) {
        onDeselect(source.trailName);
      }
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
      <Popup closeOnClick={false} closeOnEscapeKey={false}>
        <strong>{name}</strong>
      </Popup>
    </Polyline>
  );
}

export default function TrailMap() {
  const [mounted, setMounted] = useState(false);
  const [selectedTrail, setSelectedTrail] = useState<string | null>(null);

  const handleSelect = useCallback((name: string) => {
    setSelectedTrail(name);
  }, []);

  const handleDeselect = useCallback((name: string) => {
    setSelectedTrail((current) => (current === name ? null : current));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <View style={styles.container} />;
  }

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
          subdomains={WEB_TILE_SUBDOMAINS}
          maxZoom={19}
        />
        <PopupCloseHandler onDeselect={handleDeselect} />

        {geojson.features.map((feature, index) => {
          const name = feature.properties.name;
          return (
            <TrailLine
              key={`${name}-${index}`}
              name={name}
              positions={toLeafletPositions(feature.geometry.coordinates)}
              isSelected={name === selectedTrail}
              onSelect={handleSelect}
            />
          );
        })}

      </MapContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
