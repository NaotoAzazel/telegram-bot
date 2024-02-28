import { Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext, SessionData } from "../context/context.interface";
import { ISessionService } from "../service/session/session.interface";
import { InlineQueryResultArticle } from "telegraf/typings/core/types/typegram";
import { generateNumberInlineQuery, generateTextInlineQuery, generateMovieInlineQuery } from "../libs/utils";
import { GENRES } from "../config/ui-config.constants";
import Menu from "../config/menu.class";
import { IDatabase } from "../service/database/database.interface";
import { DEFAULT_VALUES } from "../schema/session.schema";

export default class InlineEvent extends Command {
  constructor(bot: Telegraf<IBotContext>, session: ISessionService, database: IDatabase) { 
    super(bot, session, database);
  }

  async validateFilterValue(filterType: string, chosenValue: string, session: SessionData): Promise<any> {
    switch (filterType) {
      case "minRating":
        return Number(chosenValue) > session.maxRating
          ? { maxRating: chosenValue, minRating: chosenValue }
          : { minRating: chosenValue };

      case "maxRating":
        return Number(chosenValue) < session.minRating
          ? { maxRating: chosenValue, minRating: chosenValue }
          : { maxRating: chosenValue };

      case "startYear":
        return Number(chosenValue) > session.endYear
          ? { startYear: chosenValue, endYear: chosenValue }
          : { startYear: chosenValue };

      case "endYear":
        return Number(chosenValue) < session.startYear
          ? { startYear: chosenValue, endYear: chosenValue }
          : { endYear: chosenValue };
      
      case "genre": {
        const genres: number[] = session.genre;
        const indexToRemove = genres.indexOf(Number(chosenValue));
        
        if(indexToRemove !== -1) genres.splice(indexToRemove, 1);
        else genres.push(Number(chosenValue));
        return { genre: genres };
      }
    }
  }

  handle(): void {
    this.bot.on("message", (ctx, next) => {
      this.session.setLastMessageId(ctx.message.message_id);
      next();
    });

    this.bot.on("chosen_inline_result", async(ctx) => {
      try {
        const userId = ctx.from.id;
        const chosenResult = ctx.chosenInlineResult;
        const mainMessage = this.session.getMainMessage();
        const lastMessageId = this.session.getLastMessageId();
  
        if(mainMessage.messageId < 0) return;
  
        const session = await this.database.findById(userId);
        if(!session) {
          throw new Error("Session not found")
        }
  
        if(chosenResult.result_id.startsWith("selected_")) {
          ctx.telegram.deleteMessage(userId, lastMessageId);
          Menu.updateMenuText(this.bot, userId, "movie", chosenResult.result_id);
          return;
        }
  
        const filterType: string = chosenResult.query.slice(7);
        const newValue = await this.validateFilterValue(filterType, chosenResult.result_id, session);
        await this.database.updateById(newValue, userId);
  
        Menu.updateMenuText(this.bot, userId, "filter");
        
        if(lastMessageId) {
          ctx.telegram.deleteMessage(userId, lastMessageId);
        }
      } catch(err) {
        console.error(err);
      }
    })

    this.bot.on("inline_query", async(ctx) => {
      try {
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
            results 
              = await generateNumberInlineQuery(DEFAULT_VALUES.startYear, DEFAULT_VALUES.endYear, 1, filterType, session);
            break;
          }
  
          case "genre": {
            results = await generateTextInlineQuery(filterType, GENRES, session);
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
      } catch(err) {
        console.error(err);
      }
    })
  }
}