import mongoose, { Schema } from "mongoose";
import { DefaultValues, SessionData } from "../types";

export const DEFAULT_VALUES: DefaultValues = {
  startYear: 1980,
  endYear: 2024,
  minRating: 1,
  maxRating: 10,
  genre: [],
};

const SessionModel = new Schema<SessionData>({
  id: { type: Number, required: true },
  startYear: { type: Number, default: DEFAULT_VALUES.startYear },
  endYear: { type: Number, default: DEFAULT_VALUES.endYear },
  minRating: { type: Number, default: DEFAULT_VALUES.minRating },
  maxRating: { type: Number, default: DEFAULT_VALUES.maxRating },
  genre: { type: [Number], default: DEFAULT_VALUES.genre },
}, { timestamps: true });

export default mongoose.model("SessionModel", SessionModel);