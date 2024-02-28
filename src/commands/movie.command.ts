import { Markup, Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { ISessionService } from "../service/session/session.interface";
import { BUTTONS, ButtonItem } from "../config/ui-config.constants";
import { IDatabase } from "../service/database/database.interface";
import { MovieApiService } from "../service/movie-api/movie-api.service";
import { IMovieApi, MovieDetail } from "../service/movie-api/movie-api.interface";
import Menu from "../config/menu.class";

export default class MovieCommand extends Command {
  constructor(bot: Telegraf<IBotContext>, session: ISessionService, database: IDatabase) { 
    super(bot, session, database);
  }

  handle(): void {
    this.bot.action("movie", async(ctx) => {
      try {
        const baseImageUrl = "https://image.tmdb.org/t/p/w500/";
        const mainMessage = this.session.getMainMessage();
        const buttons = (BUTTONS.movieMenu.buttons as ButtonItem[]).map(button => 
          Markup.button.callback(button.name, button.value));
  
        const apiService: IMovieApi = new MovieApiService();
        const movie: MovieDetail = await apiService.searchById(ctx.callbackQuery.id.slice(9));
  
        const movieMenuText = Menu.createMovieMenu(movie);
        await ctx.telegram.deleteMessage(mainMessage.chatId, mainMessage.messageId);
        
        const newMainMessage = await ctx.telegram.sendPhoto(
          mainMessage.chatId,
          baseImageUrl + movie.poster_path,
          { caption: movieMenuText, parse_mode: "HTML" }
        );
  
        this.session.setMainMessage({ 
          messageId: newMainMessage.message_id, 
          chatId: newMainMessage.chat.id 
        });
  
        await ctx.telegram.editMessageReplyMarkup(mainMessage.chatId, mainMessage.messageId, undefined,
          Markup.inlineKeyboard(buttons, { columns: 2 }).reply_markup
        );
      } catch(err) {
        console.error(err);
      }
    })
  }
}