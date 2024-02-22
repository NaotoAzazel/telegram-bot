import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { ISessionService } from "../service/session.interface";
import { BUTTONS, ButtonItem } from "../config/ui-config.constants";
import Menu from "../config/menu.class";

export default class MenuCommand extends Command {
  constructor(bot: Telegraf<IBotContext>, session: ISessionService) { 
    super(bot, session);
  }

  handle(): void {
    this.bot.action("menu", async(ctx) => {
      const userId = ctx.from!.id;
      const session = await this.session.findById(userId);
      if(!session) {
        throw new Error("Session not found");
      }

      const buttons = (BUTTONS.mainMenu.buttons as ButtonItem[]).map(button => 
        Markup.button.callback(button.name, button.value)
      );
      const inlineButtons = (BUTTONS.mainMenu.switchToInline as ButtonItem[]).map(button => 
        Markup.button.switchToCurrentChat(button.name, button.value)
      );
      const mainMenuText = Menu.createMainMenuText(session);

      ctx.editMessageText(mainMenuText, Markup.inlineKeyboard([...buttons, ...inlineButtons]))
    })
  }
}