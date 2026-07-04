import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectDb } from "./db";
import "./models/trail";

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;

if (!MONGO_CONNECTION_STRING) {
  throw new Error(
    "MONGO_CONNECTION_STRING is not set. Add it to your .env file (see .env.sample)."
  );
}

const mongoUri = MONGO_CONNECTION_STRING;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.send("Hello World");
});

async function start() {
  await connectDb(mongoUri);

  app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
}

start()
