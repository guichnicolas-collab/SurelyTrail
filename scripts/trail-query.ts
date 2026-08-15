import dotenv from "dotenv";
import { connectDb, mongoose } from "../db";
import { Trail } from "../models/trail";

dotenv.config();

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
if (!MONGO_CONNECTION_STRING) {
  throw new Error("MONGO_CONNECTION_STRING is not set.");
}
const mongoUri: string = MONGO_CONNECTION_STRING;

async function main() {
  await connectDb(mongoUri);

  const searchArea = {
    type: "Polygon",
    coordinates: [
      [
        [-119.99524, 38.84991], // NW (top-left)
        [-119.99217, 38.84991], // NE (top-right)
        [-119.99217, 38.84773], // SE (bottom-right)
        [-119.99524, 38.84773], // SW (bottom-left)
        [-119.99524, 38.84991], // close the ring (same as first)
      ],
    ],
  };

  const nearbyTrails = await Trail.find({
    location: {
      $geoIntersects: {
        $geometry: searchArea,
      },
    },
  });

  console.log(`"Found ${nearbyTrails.length} trail(s)"`);
  await mongoose.disconnect();
}

main();
