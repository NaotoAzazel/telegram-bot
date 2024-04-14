import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { ISessionService } from "../service/session/session.interface";

export abstract class Command {
  constructor(
    public bot: Telegraf<IBotContext>, 
    public session: ISessionService,
  ) {}

  abstract handle(): void;
}