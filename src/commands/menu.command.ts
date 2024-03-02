import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { ISessionService } from "../service/session/session.interface";
import { BUTTONS } from "../config/ui-config.constants";
import { callbackQuery } from "telegraf/filters"
import { DatabaseService } from "../service/database/database.service";
import { MainMessage, SessionData } from "../types";
import { ButtonItem } from "../types/ui";
import Menu from "../config/menu.class";

export default class MenuCommand extends Command {
  constructor(bot: Telegraf<IBotContext>, session: ISessionService) { 
    super(bot, session);
  }

  handle(): void {
    this.bot.action(["menu", "redirect_menu"], async(ctx) => {
      try {
        const userId: number = ctx.from!.id;
        const mainMessage: MainMessage = this.session.getMainMessage();
        const session: SessionData = await DatabaseService.findById(userId);
  
        const buttons = (BUTTONS.mainMenu.buttons as ButtonItem[]).map(button => 
          Markup.button.callback(button.name, button.value));
          
        const inlineButtons = (BUTTONS.mainMenu.switchToInline as ButtonItem[]).map(button => 
          Markup.button.switchToCurrentChat(button.name, button.value));
  
        const mainMenuText: string = Menu.createMainMenuText(session);
        
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
      } catch(err) {
        console.error(err);
      }
    })
  }
}