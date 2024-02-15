import { Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { ISessionService } from "../service/session.interface";

export default class InlineEvent extends Command {
  constructor(bot: Telegraf<IBotContext>, session: ISessionService) { 
    super(bot);
    this.session = session;
  }

  handle(): void {
    this.bot.on("inline_query", async(ctx) => {
      const filterType = ctx.inlineQuery.query.slice(7);
      
      // TODO: added logic for each button from filter menu
      switch(filterType) {
        case "minRating": {
        }
      }
    })
  }
}