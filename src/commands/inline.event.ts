import { Telegraf } from "telegraf";
import { Command } from "./command.class";
import { IBotContext, SessionData } from "../context/context.interface";
import { ISessionService } from "../service/session.interface";
import { InlineQueryResultArticle } from "telegraf/typings/core/types/typegram";
import { generateNumberInlineQuery, generateTextInlineQuery } from "../utils";
import { GENRES, TYPES } from "../config/genresAndTypes.constants";

export default class InlineEvent extends Command {
  constructor(bot: Telegraf<IBotContext>, session: ISessionService) { 
    super(bot, session);
  }

  handle(): void {
    this.bot.on("message", (ctx, next) => {
      this.session?.setLastMessageId(ctx.message.message_id);
      next();
    });

    this.bot.on("chosen_inline_result", async(ctx) => {
      const userId = ctx.from.id;
      const chosenResult = ctx.chosenInlineResult;
      const mainMessage = this.session.getMainMessage();
      const lastMessageId = this.session.getLastMessageId();

      if(mainMessage.messageId < 0) return;

      let session = await this.session.findById(userId);
      if(!session) {
        throw new Error("Session not found")
      }

      const filterType = chosenResult.query.slice(7);
      const choseResult = ctx.chosenInlineResult;

      switch(filterType) {
        case "minRating": {
          if(Number(choseResult.result_id) > session.maxRating) {
            await this.session.updateById({ maxRating: choseResult.result_id }, userId);
          }
          break;
        }

        case "maxRating": {
          if(Number(choseResult.result_id) < session.minRating) {
            await this.session.updateById({ minRating: choseResult.result_id }, userId);
          }
          break;
        }

        case "startYear": {
          if(Number(choseResult.result_id) > session.endYear) {
            await this.session.updateById({ endYear: choseResult.result_id }, userId);
          }
          break;
        }

        case "endYear": {
          if(Number(choseResult.result_id) < Number(session.startYear)) {
            await this.session.updateById({ startYear: choseResult.result_id }, userId);
          }
          break;
        }

        case "genre": {
          if(choseResult.result_id === "All") {
            choseResult.result_id = "";
          }
          break;
        }
      }

      await this.session.updateById({ [filterType as keyof SessionData]: choseResult.result_id }, userId);
      
      const uniqueNumber: number = new Date().getTime();
      this.bot.handleUpdate({
        update_id: uniqueNumber,
        callback_query: {
          id: uniqueNumber.toString(),
          from: { 
            id: userId, 
            is_bot: false, 
            first_name: "firtsName" 
          }, 
          message: undefined,
          chat_instance: uniqueNumber.toString(),
          data: "filter"
        }
      });
      
      if(lastMessageId) { // fix when deleting message that contain error message
        ctx.telegram.deleteMessage(ctx.from.id, lastMessageId);
      }
    })

    this.bot.on("inline_query", async(ctx) => {
      const userId = ctx.from.id;
      const filterType = ctx.inlineQuery.query.slice(7);
      
      let results: InlineQueryResultArticle[] = [];
      switch(filterType) {
        case "minRating":
        case "maxRating": {
          results = await generateNumberInlineQuery(0.2, 10, 0.2, userId, filterType, this.session);
          break;
        } 

        case "startYear":
        case "endYear": {
          results = await generateNumberInlineQuery(1975, 2020, 1, userId, filterType, this.session);
          break;
        }

        case "genre":
        case "type": {
          results = 
            await generateTextInlineQuery(userId, filterType, filterType === "genre" ? GENRES : TYPES, this.session);
          break;
        }
      }
      
      ctx.answerInlineQuery(results);
    })
  }
}