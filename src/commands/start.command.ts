import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { ISessionService } from "../service/session.interface";
import { BUTTONS, ButtonItem } from "../config/ui-config.constants";
import Menu from "../config/menu.class";
import { IDatabase } from "../service/database.interface";

export default class StartCommand extends Command {
  constructor(bot: Telegraf<IBotContext>, session: ISessionService, database: IDatabase) { 
    super(bot, session, database);
  }

  handle(): void {
    this.bot.start(async(ctx) => {
      const id = ctx.from.id;
      const buttons = (BUTTONS.startMenu.buttons as ButtonItem[]).map(button => 
        Markup.button.callback(button.name, button.value)
      );

      this.checkUserSession(id);

      const startMenuText = Menu.createStartMenuText();
      const replyMessage = await ctx.reply(startMenuText, Markup.inlineKeyboard(buttons));
      this.session.setMainMessage({
        messageId: replyMessage.message_id, 
        chatId: replyMessage.chat.id 
      });
    });
  }
}