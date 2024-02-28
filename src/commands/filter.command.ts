import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { ISessionService } from "../service/session/session.interface";
import { DEFAULT_VALUES, DefaultValues } from "../schema/session.schema";
import { BUTTONS, ButtonItem } from "../config/ui-config.constants";
import Menu from "../config/menu.class";
import { IDatabase } from "../service/database/database.interface";

export default class FilterCommand extends Command {
  constructor(bot: Telegraf<IBotContext>, session: ISessionService, database: IDatabase) { 
    super(bot, session, database);
  }

  handle(): void {
    this.bot.action("reset", async(ctx) => {
      try {
        const preventDefault: DefaultValues = {
          startYear: DEFAULT_VALUES["startYear"],
          endYear: DEFAULT_VALUES["endYear"],
          minRating: DEFAULT_VALUES["minRating"],
          maxRating: DEFAULT_VALUES["maxRating"],
          genre: DEFAULT_VALUES["genre"],
        };
  
        await this.database.updateById(preventDefault, ctx.from!.id);
        Menu.updateMenuText(this.bot, ctx.from!.id, "filter");
      } catch(err) {
        console.error(err);
      }
    })

    this.bot.action("filter", async(ctx) => {
      try {
        const userId = ctx.from!.id;
        const mainMessage = this.session?.getMainMessage();
        const session = await this.database?.findById(userId);
        if(!session) {
          throw new Error("Session not found");
        }
  
        const buttons = (BUTTONS.filterMenu.buttons as ButtonItem[]).map(button => 
          Markup.button.callback(button.name, button.value)
        );
        const inlineButtons = (BUTTONS.filterMenu.switchToInline as ButtonItem[]).map(button => 
          Markup.button.switchToCurrentChat(button.name, button.value)
        );
  
        const filterMenuText = Menu.createFilterMenuText(session);
        await ctx.telegram.editMessageText(
          mainMessage?.chatId, mainMessage?.messageId, undefined, filterMenuText
        );
  
        await ctx.telegram.editMessageReplyMarkup(mainMessage?.chatId, mainMessage?.messageId, undefined,
          Markup.inlineKeyboard([...inlineButtons, ...buttons], { columns: 2 }).reply_markup
        )
      } catch(err) {
        console.error(err);
      }
    });
    
  }
}