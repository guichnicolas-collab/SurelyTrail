import fs from "fs";
import path from "path";
import osmtogeojson from "osmtogeojson";
import type { Feature, LineString } from "geojson";
import dotenv from "dotenv";
import { connectDb, mongoose } from "../db";
import { Trail } from "../models/trail";

const CACHE_FILE = path.resolve(__dirname, "osm-cache.json");

dotenv.config();

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
if (!MONGO_CONNECTION_STRING) {
  throw new Error("MONGO_CONNECTION_STRING is not set.");
}
const mongoUri: string = MONGO_CONNECTION_STRING;

function isLineString(f: Feature): f is Feature<LineString> {
  return f.geometry.type === "LineString";
}

async function main() {
  await connectDb(mongoUri);
  await Trail.deleteMany({});
  console.log("Cleared existing trails");

  let osmData;

  if (fs.existsSync(CACHE_FILE)) {
    console.log("Loading cached OSM data from", CACHE_FILE);
    osmData = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
  } else {
    console.log("Fetching trails from Overpass API...");
    const query = `[out:json][timeout:120];
(
  way["highway"="path"]["name"](38.8,-120.1,39.1,-119.8);
  relation["route"="hiking"]["name"](38.8,-120.1,39.1,-119.8);
);
(._;>;);
out body;`;

    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "*/*",
        "User-Agent": "SurelyTrail/1.0",
      },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!res.ok) {
      throw new Error(
        `Overpass API returned ${res.status}: ${await res.text()}`,
      );
    }

    osmData = await res.json();
    fs.writeFileSync(CACHE_FILE, JSON.stringify(osmData));
    console.log("Cached response to", CACHE_FILE);
  }

  console.log(`Got ${osmData.elements.length} OSM elements`);

  const geojson = osmtogeojson(osmData);
  const lineFeatures = geojson.features.filter(isLineString);
  console.log(`Converting to ${lineFeatures.length} trail(s)...`);

  let inserted = 0;

  const MAX_COORDS = 500;
  const smallTrails = lineFeatures.filter(
    (f) => f.geometry.coordinates.length <= MAX_COORDS,
  );
  console.log(`${smallTrails.length} trails have <= ${MAX_COORDS} coordinates`);

  for (const feature of smallTrails) {
    const name: string = feature.properties?.name || "Unnamed";
    const coords = feature.geometry.coordinates;
    const lngs = coords.map((c) => c[0]);
    const lats = coords.map((c) => c[1]);

    await Trail.create({
      name,
      location: { type: "LineString", coordinates: coords },
      bounds: {
        north: Math.max(...lats),
        south: Math.min(...lats),
        east: Math.max(...lngs),
        west: Math.min(...lngs),
      },
      startPoint: { type: "Point", coordinates: coords[0] },
      endPoint: { type: "Point", coordinates: coords[coords.length - 1] },
      source: "openstreetmap",
    });

    inserted++;
  }

  console.log(`Done! Inserted ${inserted} trails.`);
  await mongoose.disconnect();
}

main();
