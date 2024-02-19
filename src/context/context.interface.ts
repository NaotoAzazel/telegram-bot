import { Context } from "telegraf";

export interface SessionData {
  id: number;
  startYear: number;
  endYear: number;
  minRating: number;
  maxRating: number;
  genre: string;
  type: string;
  createdAt: Date;
}

export interface IBotContext extends Context {
  session: SessionData; 
}