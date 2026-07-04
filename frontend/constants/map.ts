export const INITIAL_REGION = {
  latitude: 39.09,
  longitude: -120.03,
  latitudeDelta: 0.4,
  longitudeDelta: 0.4,
};

export const TRAIL_COLOR = "#1d3557";
export const SELECTED_TRAIL_COLOR = "#e63946";
export const TRAIL_WIDTH = 3;
export const SELECTED_TRAIL_WIDTH = 3;
export const MAP_STYLE = "light_all";

// Leaflet supports {s} subdomains and {r} for retina (@2x).
export const WEB_TILE_URL = `https://{s}.basemaps.cartocdn.com/${MAP_STYLE}/{z}/{x}/{y}{r}.png`;
export const WEB_TILE_SUBDOMAINS = "abcd";

// react-native-maps UrlTile only replaces {x}, {y}, and {z}.
export const NATIVE_TILE_URL = `https://a.basemaps.cartocdn.com/${MAP_STYLE}/{z}/{x}/{y}.png`;
