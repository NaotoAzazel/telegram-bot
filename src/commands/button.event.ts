import { Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { ISessionService } from "../service/session.interface";
import Menu from "../config/menu.class";
import { IDatabase } from "../service/database.interface";

export default class ButtonEvent extends Command {
  constructor(bot: Telegraf<IBotContext>, session: ISessionService, database: IDatabase) { 
    super(bot, session, database);
  }

  handle(): void {
    this.bot.on("callback_query", async(ctx, next) => {
      try {
        const mainMessage = this.session?.getMainMessage();
        const callbackQuery = ctx.callbackQuery;
        const errorMenuText = Menu.createErrorMenu();
  
        if(callbackQuery && mainMessage!.messageId < 0) {
          await ctx.telegram.deleteMessage(callbackQuery.from.id, callbackQuery.message!.message_id);
          ctx.reply(errorMenuText);
          return false;
        }
        next();
      } catch(err) {
        console.error(err);
      }
    });
  }
}