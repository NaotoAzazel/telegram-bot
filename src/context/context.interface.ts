import { Context } from "telegraf";

export interface SessionData {
  exampleField: boolean;
}

export interface IBotContext extends Context {
  session: SessionData; 
}