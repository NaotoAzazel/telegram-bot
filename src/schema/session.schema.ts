import mongoose, { Schema } from "mongoose";
import { SessionData } from "../context/context.interface";

export type DefaultValues = {
  startYear: number;
  endYear: number;
  minRating: number;
  maxRating: number,
  genre: string;
  type: string;
}

const DEFAULT_VALUES: DefaultValues = {
  startYear: 1975,
  endYear: 2020,
  minRating: 1,
  maxRating: 10,
  genre: "",
  type: "movie"
};

const SessionModel = new Schema<SessionData>({
  id: { type: Number, required: true },
  startYear: { type: Number, default: DEFAULT_VALUES.startYear },
  endYear: { type: Number, default: DEFAULT_VALUES.endYear },
  minRating: { type: Number, default: DEFAULT_VALUES.minRating },
  maxRating: { type: Number, default: DEFAULT_VALUES.maxRating },
  genre: { type: String, default: DEFAULT_VALUES.genre },
  type: { type: String, default: DEFAULT_VALUES.type }
}, { timestamps: true });

export default mongoose.model("SessionModel", SessionModel);