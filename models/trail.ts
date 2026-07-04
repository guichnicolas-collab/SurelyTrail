import mongoose, { InferSchemaType, Model, Schema } from "mongoose";

const trailSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },

  description: String,

  difficulty: {
    type: String,
    enum: ["easy", "moderate", "hard"],
  },

  distance: Number, // meters
  elevationGain: Number, // meters
  estimatedTime: Number, // minutes

  location: {
    type: {
      type: String,
      enum: ["LineString"],
      required: true,
    },
    coordinates: {
      type: [[Number]],
      required: true,
    },
  },

  bounds: {
    north: Number,
    south: Number,
    east: Number,
    west: Number,
  },

  startPoint: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: [Number],
  },

  endPoint: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: [Number],
  },

  tags: [String],

  source: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

trailSchema.index({ location: "2dsphere" });
trailSchema.index({ startPoint: "2dsphere" });
trailSchema.index({ endPoint: "2dsphere" });

export type TrailDocument = InferSchemaType<typeof trailSchema>;

export const Trail: Model<TrailDocument> =
  (mongoose.models.Trail as Model<TrailDocument> | undefined) ??
  mongoose.model<TrailDocument>("Trail", trailSchema);
