import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";

export class StartCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) { 
    super(bot);
  }

  handle(): void {
    this.bot.start((ctx) => {
      console.log("Session:", ctx.session);
      ctx.reply(
        "Text",
        Markup.inlineKeyboard([
          Markup.button.callback("✅", "button")
        ])
      );
    });

    this.bot.action("button", (ctx) => {
      ctx.session.exampleField = true;
      ctx.editMessageText("Button clicked");
    })
  }
}