import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { ISessionService } from "../service/session.interface";
import { BUTTONS } from "../config/buttons";

export default class StartCommand extends Command {
  constructor(bot: Telegraf<IBotContext>, session: ISessionService) { 
    super(bot);
    this.session = session;
  }

  handle(): void {
    const buttons = BUTTONS.startMenu.buttons ? 
      BUTTONS.startMenu.buttons.map(button => Markup.button.callback(button.name, button.value)) : [];

    this.bot.start(async(ctx) => {
      const id = String(ctx.from?.id);
      this.checkUserSession(id);

      ctx.reply("Для начала роботы с ботом нажмите ниже", Markup.inlineKeyboard(buttons));
    });
  }
}