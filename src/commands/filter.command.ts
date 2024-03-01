import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext, SessionData } from "../context/context.interface";
import { ISessionService } from "../service/session/session.interface";
import { DEFAULT_VALUES, DefaultValues } from "../schema/session.schema";
import { BUTTONS, ButtonItem } from "../config/ui-config.constants";
import { DatabaseService } from "../service/database/database.service";
import { MainMessage } from "../service/session/session.service";
import Menu from "../config/menu.class";

export default class FilterCommand extends Command {
  constructor(bot: Telegraf<IBotContext>, session: ISessionService) { 
    super(bot, session);
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
        
        await DatabaseService.updateById(preventDefault, ctx.from!.id);
        Menu.updateMenuText(this.bot, ctx.from!.id, "filter");
      } catch(err) {
        console.error(err);
      }
    })

    this.bot.action("filter", async(ctx) => {
      try {
        const userId: number = ctx.from!.id;
        const mainMessage: MainMessage = this.session.getMainMessage();
        const session: SessionData = await DatabaseService.findById(userId);
  
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