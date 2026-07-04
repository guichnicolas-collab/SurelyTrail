import mongoose from "mongoose";

export async function connectDb(uri: string): Promise<void> {
  await mongoose.connect(uri.trim());
  console.log("Connected to MongoDB");
}

export { mongoose };
