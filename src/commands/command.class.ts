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

  async checkUserSession(id: number): Promise<void> {
    if(this.session) {
      const userSession = await this.database.findById(id);
      if(!userSession) {
        await this.database?.create(id);
      }
    }
  }

  abstract handle(): void;
}