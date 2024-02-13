import { Context } from "telegraf";

export interface SessionData {
  id: string;
  startYear?: string;
  endYear?: string;
  minRating?: string;
  maxRating?: string;
  genre?: string;
  type?: string;
  createdAt: Date;
}

export interface IBotContext extends Context {
  session: SessionData; 
}