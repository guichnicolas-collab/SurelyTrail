export type TrailFeature = {
  type: "Feature";
  properties: { name: string };
  geometry: {
    type: "LineString";
    coordinates: [number, number][];
  };
};

export type TrailCollection = {
  type: "FeatureCollection";
  features: TrailFeature[];
};