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
        way["highway"~"^(path|footway|pedestrian|steps|bridleway|cycleway|track|corridor)$"](38.8,-120.1,39.1,-119.8);
        relation["route"="hiking"](38.8,-120.1,39.1,-119.8);
        relation["route"="foot"](38.8,-120.1,39.1,-119.8);
        relation["route"="bicycle"](38.8,-120.1,39.1,-119.8);
        relation["route"="horse"](38.8,-120.1,39.1,-119.8);
      );

      (._;>;);

      out body;
    `;

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
  console.log(`Ingesting ${lineFeatures.length} trails`);
  let unnamedId = 1;
  for (const feature of lineFeatures) {
    const name: string = feature.properties?.name || "Unnamed" + unnamedId++;

    const coords: [number, number][] = feature.geometry.coordinates.map(
      ([lng, lat]) => [lng, lat],
    );

    const lngs = coords.map((c) => c[0]);
    const lats = coords.map((c) => c[1]);

    const distance = calculateDistance(coords);

    await Trail.create({
      name,
      location: { type: "LineString", coordinates: coords },
      bounds: {
        north: Math.max(...lats),
        south: Math.min(...lats),
        east: Math.max(...lngs),
        west: Math.min(...lngs),
      },
      distance,
      startPoint: { type: "Point", coordinates: coords[0] },
      endPoint: { type: "Point", coordinates: coords[coords.length - 1] },
      source: "openstreetmap",
    });

    inserted++;
  }

  console.log(`Done! Inserted ${inserted} trails.`);
  await mongoose.disconnect();
}

function calculateDistance(coordinates: [number, number][]): number {
  const R = 6371000; // Earth radius in meters
  let distance = 0;

  for (let i = 1; i < coordinates.length; i++) {
    const [lon1, lat1] = coordinates[i - 1];
    const [lon2, lat2] = coordinates[i];

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    distance += R * c;
  }

  return distance;
}

main();
