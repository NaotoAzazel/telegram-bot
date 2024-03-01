import { Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { ISessionService } from "../service/session/session.interface";
import { MainMessage } from "../service/session/session.service";
import { CallbackQuery } from "telegraf/typings/core/types/typegram";
import Menu from "../config/menu.class";

export default class ButtonEvent extends Command {
  constructor(bot: Telegraf<IBotContext>, session: ISessionService) { 
    super(bot, session);
  }

  handle(): void {
    this.bot.on("callback_query", async(ctx, next) => {
      try {
        const mainMessage: MainMessage = this.session.getMainMessage();
        const callbackQuery: CallbackQuery = ctx.callbackQuery;
        const errorMenuText: string = Menu.createErrorMenu();
  
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