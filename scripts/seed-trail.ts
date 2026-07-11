import fs from "fs";
import dotenv from "dotenv";
import { connectDb, mongoose } from "../db";
import { Trail } from "../models/trail";

dotenv.config();

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
if (!MONGO_CONNECTION_STRING) {
  throw new Error("MONGO_CONNECTION_STRING is not set.");
}

async function main() {
  await connectDb(MONGO_CONNECTION_STRING);

  const geojson = JSON.parse(
    fs.readFileSync("./scripts/saxon-creek-trail.geojson", "utf-8"),
  );

  // First feature is the full trail relation (LineString)
  const feature = geojson.features[0];
  const coords = feature.geometry.coordinates;

  // Compute bounding box
  const lngs = coords.map((c: number[]) => c[0]);
  const lats = coords.map((c: number[]) => c[1]);
  const bounds = {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs),
  };

  const trail = await Trail.create({
    name: feature.properties.name, // "Tahoe Rim Trail"
    description:
      "A steep bike trail in South Lake Tahoe. Also known as 'Mr. Toad's Wild Ride'",
    difficulty: "hard",
    distance: 265541,
    elevationGain: 10000,
    estimatedTime: 14400,
    location: feature.geometry, // { type: "LineString", coordinates: [...] }
    bounds,
    startPoint: { type: "Point", coordinates: coords[0] },
    endPoint: { type: "Point", coordinates: coords[coords.length - 1] },
    tags: ["thru-hike", "tahoe"],
    source: "openstreetmap",
  });

  console.log("Created trail:", trail.name, trail._id);
  console.log(`  ${coords.length} coordinate points`);
  console.log(
    `  Bounds: N${bounds.north} S${bounds.south} E${bounds.east} W${bounds.west}`,
  );

  await mongoose.disconnect();
}

main();
