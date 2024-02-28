import { Context } from "telegraf";

export interface SessionData {
  id: number;
  startYear: number;
  endYear: number;
  minRating: number;
  maxRating: number;
  genre: number[];
  createdAt: Date;
}

export interface IBotContext extends Context {
  session: SessionData; 
}