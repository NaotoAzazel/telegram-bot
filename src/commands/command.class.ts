import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { ISessionService } from "../service/session.interface";

export abstract class Command {
  constructor(
    public bot: Telegraf<IBotContext>, 
    public session: ISessionService
  ) {}

  async checkUserSession(id: string): Promise<void> {
    if(this.session) {
      const userSession = await this.session.findById(id);
      if(!userSession) {
        await this.session.create(id);
      }
    }
  }

  abstract handle(): void;
}