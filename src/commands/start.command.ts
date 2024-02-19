import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { ISessionService } from "../service/session.interface";
import { BUTTONS } from "../config/buttons";
import Menu from "../config/menu.class";

export default class StartCommand extends Command {
  constructor(bot: Telegraf<IBotContext>, session: ISessionService) { 
    super(bot, session);
  }

  handle(): void {
    const buttons = BUTTONS.startMenu.buttons ? 
      BUTTONS.startMenu.buttons.map(button => Markup.button.callback(button.name, button.value)) : [];

    this.bot.start(async(ctx) => {
      const id = ctx.from.id;
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