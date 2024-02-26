import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { ISessionService } from "../service/session.interface";
import { BUTTONS, ButtonItem } from "../config/ui-config.constants";
import Menu from "../config/menu.class";
import { IDatabase } from "../service/database.interface";
import { callbackQuery } from "telegraf/filters"

export default class MenuCommand extends Command {
  constructor(bot: Telegraf<IBotContext>, session: ISessionService, database: IDatabase) { 
    super(bot, session, database);
  }

  handle(): void {
    this.bot.action(["menu", "redirect_menu"], async(ctx) => {
      const userId = ctx.from!.id;
      const mainMessage = this.session.getMainMessage();
      const session = await this.database.findById(userId);
      if(!session) {
        throw new Error("Session not found");
      }

      const buttons = (BUTTONS.mainMenu.buttons as ButtonItem[]).map(button => 
        Markup.button.callback(button.name, button.value));
        
      const inlineButtons = (BUTTONS.mainMenu.switchToInline as ButtonItem[]).map(button => 
        Markup.button.switchToCurrentChat(button.name, button.value));

      const mainMenuText = Menu.createMainMenuText(session);
      
      // redirected from movie menu
      if(ctx.has(callbackQuery("data")) && ctx.callbackQuery.data.startsWith("redirect_")) {
        await ctx.telegram.deleteMessage(mainMessage.chatId, mainMessage.messageId);
        
        const newMainMessage = await ctx.telegram.sendMessage(mainMessage.chatId, mainMenuText);
        this.session.setMainMessage({ 
          messageId: newMainMessage.message_id, chatId: newMainMessage.chat.id 
        });
        
        await ctx.telegram.editMessageReplyMarkup(mainMessage.chatId, mainMessage.messageId, undefined,
          Markup.inlineKeyboard([...buttons, ...inlineButtons]).reply_markup
        );
        return;
      }

      ctx.editMessageText(mainMenuText, Markup.inlineKeyboard([...buttons, ...inlineButtons]));
    })
  }
}