import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { ISessionService } from "../service/session.interface";
import { BUTTONS } from "../config/buttons";

export default class FilterCommand extends Command {
  constructor(bot: Telegraf<IBotContext>, session: ISessionService) { 
    super(bot);
    this.session = session;
  }

  handle(): void {
    if(!BUTTONS.filterMenu.switchToInline || !BUTTONS.filterMenu.buttons) {
      throw new Error("Cant find buttons");
    }

    const inlineButtons = BUTTONS.filterMenu.switchToInline.map(button => 
      Markup.button.switchToCurrentChat(button.name, button.value)
    );

    const buttons = BUTTONS.filterMenu.buttons.map(button => 
      Markup.button.callback(button.name, button.value)
    );

    const allButtons = [...inlineButtons, ...buttons];

    this.bot.action("filter", async(ctx) => {
      const userId = String(ctx.from?.id);
      const session = await this.session?.findById(userId);

      ctx.editMessageText(
        "Меню фильтров\n\n" +
        "Выбери фильтры и жми \"Искать по фильтру\`\n\n" +
        "Выбрано:\n" +
        `📈 Рейтинг: ${session?.minRating} - ${session?.maxRating}\n` +
        `📅 Начиная с года: ${session?.startYear}\n` +
        `📆 До года: ${session?.endYear}\n` +
        `🎵 Жанр: ${session?.genre || "Все"}\n` +
        `🔀 Тип: ${session?.type || "Все"}\n`
      , Markup.inlineKeyboard(allButtons, { columns: 2 }));
    });
  }
}