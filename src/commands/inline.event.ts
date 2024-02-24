import { Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext, SessionData } from "../context/context.interface";
import { ISessionService } from "../service/session.interface";
import { InlineQueryResultArticle } from "telegraf/typings/core/types/typegram";
import { generateNumberInlineQuery, generateTextInlineQuery, generateMovieInlineQuery } from "../utils";
import { GENRES, TYPES } from "../config/ui-config.constants";
import Menu from "../config/menu.class";
import { IDatabase } from "../service/database.interface";

export default class InlineEvent extends Command {
  constructor(bot: Telegraf<IBotContext>, session: ISessionService, database: IDatabase) { 
    super(bot, session, database);
  }

  handle(): void {
    this.bot.on("message", (ctx, next) => {
      this.session.setLastMessageId(ctx.message.message_id);
      next();
    });

    this.bot.on("chosen_inline_result", async(ctx) => {
      const userId = ctx.from.id;
      const chosenResult = ctx.chosenInlineResult;
      const mainMessage = this.session.getMainMessage();
      const lastMessageId = this.session.getLastMessageId();

      if(mainMessage.messageId < 0) return;

      const session = await this.database.findById(userId);
      if(!session) {
        throw new Error("Session not found")
      }

      const filterType = chosenResult.query.slice(7);
      switch(filterType) {
        case "minRating": {
          if(Number(chosenResult.result_id) > session.maxRating) {
            await this.database.updateById({ maxRating: chosenResult.result_id }, userId);
          }
          break;
        }

        case "maxRating": {
          if(Number(chosenResult.result_id) < session.minRating) {
            await this.database.updateById({ minRating: chosenResult.result_id }, userId);
          }
          break;
        }

        case "startYear": {
          if(Number(chosenResult.result_id) > session.endYear) {
            await this.database.updateById({ endYear: chosenResult.result_id }, userId);
          }
          break;
        }

        case "endYear": {
          if(Number(chosenResult.result_id) < Number(session.startYear)) {
            await this.database.updateById({ startYear: chosenResult.result_id }, userId);
          }
          break;
        }

        case "genre": {
          if(chosenResult.result_id === "All") {
            chosenResult.result_id = "";
          }
          break;
        }
      }
      await this.database.updateById({ [filterType as keyof SessionData]: chosenResult.result_id }, userId);
      Menu.updateMenuText(this.bot, ctx.from!.id, "filter");
      
      if(lastMessageId) {
        ctx.telegram.deleteMessage(ctx.from.id, lastMessageId);
      }
    })

    this.bot.on("inline_query", async(ctx) => {
      const userId = ctx.from.id;
      const inlineQuery = ctx.inlineQuery.query;
      const mainMessage = this.session.getMainMessage();
      let results: InlineQueryResultArticle[] = [];
      
      if(mainMessage.messageId < 0) {
        results = [{
          type: "article",
          id: "error",
          title: Menu.createErrorMenu(),
          input_message_content: {
            message_text: Menu.createErrorMenu(),
          }
        }];
        
        ctx.answerInlineQuery(results, { cache_time: 1 });
        return false;
      }

      const session = await this.database.findById(userId);
      if(!session) {
        throw new Error("Session not found");
      }

      if(!inlineQuery.startsWith("filter") && inlineQuery.length >= 1) {
        results = await generateMovieInlineQuery({ searchType: "searchByTitle", title: inlineQuery });
      }

      const filterType = inlineQuery.slice(7);
      switch(filterType) {
        case "minRating":
        case "maxRating": {
          results = await generateNumberInlineQuery(0.2, 10, 0.2, filterType, session);
          break;
        }

        case "startYear":
        case "endYear": {
          results = await generateNumberInlineQuery(1975, 2020, 1, filterType, session);
          break;
        }

        case "genre":
        case "type": {
          results = 
            await generateTextInlineQuery(filterType, filterType === "genre" ? GENRES : TYPES, session);
          break;
        }
      }

      switch(inlineQuery) {
        case "": {
          results = await generateMovieInlineQuery({ searchType: "search" });
          break;
        }

        case "filter": {
          results 
            = await generateMovieInlineQuery({ searchType: "searchByParams", id: userId, fields: session });
          break;
        }
      }
      
      ctx.answerInlineQuery(results, { cache_time: 1 });
    })
  }
}