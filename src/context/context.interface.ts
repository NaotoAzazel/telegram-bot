import { Context } from "telegraf";
import { SessionData } from "../types";

export interface IBotContext extends Context {
  session: SessionData; 
}