import mongoose, { Schema } from "mongoose";
import { SessionData } from "../context/context.interface";

const SessionModel = new Schema<SessionData>({
  id: { type: String, required: true },
  startYear: { type: String, default: "" },
  endYear: { type: String, default: "" },
  minRating: { type: String, default: "" },
  maxRating: { type: String, default: "" },
  genre: { type: String, default: "" },
  type: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("SessionModel", SessionModel);