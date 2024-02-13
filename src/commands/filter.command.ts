import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { ISessionService } from "../service/session.interface";
import { BUTTONS } from "../config/buttons";

export class FilterCommand extends Command {
  constructor(bot: Telegraf<IBotContext>, session: ISessionService) { 
    super(bot);
    this.session = session;
  }

  handle(): void {
    const buttons = BUTTONS.filterMenu.map(button => 
      Markup.button.callback(button.name, button.value)  
    );

    this.bot.action("filter", (ctx) => {
      ctx.editMessageText("Меню фильтров", Markup.inlineKeyboard(buttons, { columns: 2 }));
    });
  }
}