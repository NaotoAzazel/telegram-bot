import mongoose, { Schema } from "mongoose";
import { SessionData } from "../context/context.interface";

const year = new Date().getFullYear();

const SessionModel = new Schema<SessionData>({
  id: { type: String, required: true },
  startYear: { type: String, default: "1975" },
  endYear: { type: String, default: year },
  minRating: { type: String, default: "5" },
  maxRating: { type: String, default: "10" },
  genre: { type: String, default: "" },
  type: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("SessionModel", SessionModel);