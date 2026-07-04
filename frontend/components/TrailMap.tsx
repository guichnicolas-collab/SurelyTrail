import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Polyline, UrlTile } from "react-native-maps";

import {
  INITIAL_REGION,
  NATIVE_TILE_URL,
  SELECTED_TRAIL_COLOR,
  SELECTED_TRAIL_WIDTH,
  TRAIL_COLOR,
  TRAIL_WIDTH,
} from "../constants/map";
import trails from "../trails.json";
import type { TrailCollection } from "../types/geojson";


const geojson = trails as TrailCollection;

function toLatLong(coords: [number, number][]) {
  return coords.map(([long, lat]) => ({ latitude: lat, longitude: long }));
}

export default function TrailMap() {
  const [selectedTrail, setSelectedTrail] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={INITIAL_REGION} mapType="none">
        <UrlTile
          urlTemplate={NATIVE_TILE_URL}
          maximumZ={19}
          flipY={false}
          shouldReplaceMapContent
        />
        {geojson.features.map((feature, index) => {
          const isSelected = feature.properties.name === selectedTrail;

          return (
            <Polyline
              key={`${feature.properties.name}-${index}`}
              coordinates={toLatLong(feature.geometry.coordinates)}
              strokeColor={isSelected ? SELECTED_TRAIL_COLOR : TRAIL_COLOR}
              strokeWidth={isSelected ? SELECTED_TRAIL_WIDTH : TRAIL_WIDTH}
              lineCap="round"
              lineJoin="round"
              tappable
              onPress={() => setSelectedTrail(feature.properties.name)}
            />
          );
        })}
      </MapView>
      {selectedTrail ? (
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>{selectedTrail}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  callout: {
    position: "absolute",
    bottom: 32,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
});
