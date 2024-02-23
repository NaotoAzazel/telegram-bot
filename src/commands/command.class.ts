import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { ISessionService } from "../service/session.interface";
import { IDatabase } from "../service/database.interface";

export abstract class Command {
  constructor(
    public bot: Telegraf<IBotContext>, 
    public session: ISessionService,
    public database: IDatabase
  ) {}

  abstract handle(): void;
}