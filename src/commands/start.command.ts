import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { ISessionService } from "../service/session/session.interface";
import { BUTTONS, ButtonItem } from "../config/ui-config.constants";
import { DatabaseService } from "../service/database/database.service";
import Menu from "../config/menu.class";

export default class StartCommand extends Command {
  constructor(bot: Telegraf<IBotContext>, session: ISessionService) { 
    super(bot, session);
  }

  handle(): void {
    this.bot.start(async(ctx) => {
      try {
        const id: number = ctx.from.id;
        const buttons = (BUTTONS.startMenu.buttons as ButtonItem[]).map(button => 
          Markup.button.callback(button.name, button.value)
        );
          
        await DatabaseService.findById(id);
  
        const startMenuText = Menu.createStartMenuText();
        const replyMessage = await ctx.reply(startMenuText, Markup.inlineKeyboard(buttons));
        this.session.setMainMessage({
          messageId: replyMessage.message_id, 
          chatId: replyMessage.chat.id 
        });
      } catch(err) {
        console.error(err);
      }
    });
  }
}