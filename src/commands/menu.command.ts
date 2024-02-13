import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { ISessionService } from "../service/session.interface";
import { BUTTONS } from "../config/buttons";

export class MenuCommand extends Command {
  constructor(bot: Telegraf<IBotContext>, session: ISessionService) { 
    super(bot);
    this.session = session;
  }

  handle(): void {
    const buttons = BUTTONS.mainMenu.map(button => 
      Markup.button.callback(button.name, button.value)
    );

    this.bot.action("menu", async(ctx) => {
      const id = String(ctx.from?.id);
      const userSession = await this.session?.findById(id);

      if(userSession) {
        const date = userSession.createdAt;
        date.setHours(date.getHours());

        const options: Intl.DateTimeFormatOptions = {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        };
        const formattedDate = new Intl.DateTimeFormat("ru-RU", options).format(date);
        
        ctx.editMessageText(`🆔 ${userSession?.id}\n🕗 Дата регистрации ${formattedDate}\n\nПриятного поиска!`, Markup.inlineKeyboard(buttons));
      }
    })
  }
}