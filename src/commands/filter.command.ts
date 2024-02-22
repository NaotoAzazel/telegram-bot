import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { ISessionService } from "../service/session.interface";
import { BUTTONS } from "../config/buttons";
import Menu from "../config/menu.class";
import { DEFAULT_VALUES, DefaultValues } from "../schema/session.schema";

export default class FilterCommand extends Command {
  constructor(bot: Telegraf<IBotContext>, session: ISessionService) { 
    super(bot, session);
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

    this.bot.action("reset", async(ctx) => {
      const preventDefault: DefaultValues = {
        startYear: DEFAULT_VALUES["startYear"],
        endYear: DEFAULT_VALUES["endYear"],
        minRating: DEFAULT_VALUES["minRating"],
        maxRating: DEFAULT_VALUES["maxRating"],
        genre: DEFAULT_VALUES["genre"],
        type: DEFAULT_VALUES["type"]
      };

      await this.session.updateById(preventDefault, ctx.from!.id);
      Menu.updateMenuText(this.bot, ctx.from!.id, "filter");
    })

    this.bot.action("filter", async(ctx) => {
      const userId = ctx.from!.id;
      const session = await this.session.findById(userId);
      if(!session) {
        throw new Error("Session not found");
      }

      const mainMessage = this.session.getMainMessage();
      const filterMenuText = Menu.createFilterMenuText(session);
      
      await ctx.telegram.editMessageText(
        mainMessage.chatId, mainMessage.messageId, undefined, filterMenuText
      );

      await ctx.telegram.editMessageReplyMarkup(mainMessage.chatId, mainMessage.messageId, undefined,
        Markup.inlineKeyboard([...inlineButtons, ...buttons], { columns: 2 }).reply_markup
      )
    });
  }
}