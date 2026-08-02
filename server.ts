import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectDb } from "./db";
import { Trail } from "./models/trail";

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;

if (!MONGO_CONNECTION_STRING) {
  throw new Error(
    "MONGO_CONNECTION_STRING is not set. Add it to your .env file (see .env.sample).",
  );
}

const mongoUri = MONGO_CONNECTION_STRING;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/frontend/dist"));

// CORS middleware
const allowCrossDomain = (req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  next();
};
app.use(allowCrossDomain);

app.get("/", (_req, res) => {
  res.sendFile(__dirname + "/frontend/dist/index.html");
});

app.get("/queryTrails", async (req, res) => {
  const searchArea = {
    type: "Polygon",
    coordinates: [
      [
        [req.query.swlng, req.query.nelat], // NW (top-left)
        [req.query.nelng, req.query.nelat], // NE (top-right)
        [req.query.nelng, req.query.swlat], // SE (bottom-right)
        [req.query.swlng, req.query.swlat], // SW (bottom-left)
        [req.query.swlng, req.query.nelat], // close the ring (same as first)
      ],
    ],
  };

  const nearbyTrails = await Trail.find({
    location: {
      $geoIntersects: {
        $geometry: searchArea,
      },
    },
  }).lean();
  res.json(nearbyTrails);
});

async function start() {
  await connectDb(mongoUri);

  app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
}

start();
