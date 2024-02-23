import { InlineQueryResultArticle } from "telegraf/typings/core/types/typegram";
import Menu from "./config/menu.class";
import { ISessionService } from "./service/session.interface";
import { KeyValueItem } from "./config/ui-config.constants";
import { IDatabase } from "./service/database.interface";

export async function generateNumberInlineQuery(
  start: number,
  end: number,
  step: number,
  userId: number,
  type: "minRating" | "maxRating" | "startYear" | "endYear",
  database: IDatabase,
  session: ISessionService
): Promise<InlineQueryResultArticle[]> {
  const result: InlineQueryResultArticle[] = [];
  const currentSession = await database.findById(userId);
  if (!currentSession) {
    throw new Error("Session not found");
  }

  const mainMessage = session.getMainMessage();

  for(let i = start; i <= end; i += step) {
    let formattedId: number | string = i;
    let formattedTitle: string;

    switch(type) {
      case "startYear":
      case "endYear": {
        formattedTitle = currentSession[type] === formattedId
          ? `(Выбрано) ${formattedId}`
          : `${formattedId}`;
        break;
      }

      case "maxRating":
      case "minRating": {
        formattedId = formattedId.toFixed(1);
        formattedTitle = currentSession[type].toFixed(1) === formattedId
          ? `(Выбрано) ${formattedId}`
          : `${formattedId}`;
        break;
      }
    }

    const messageText = mainMessage.messageId < 0 
      ? Menu.createErrorMenu()
      : `Вы успешно изменили значение ${type} на ${formattedId}`

    result.push({
      type: "article",
      id: formattedId.toString(),
      title: formattedTitle,
      input_message_content: {
        message_text: messageText,
      }
    });
  }

  return result;
}

export async function generateTextInlineQuery(
  userId: number,
  type: "genre" | "type",
  object: KeyValueItem,
  database: IDatabase,
  session: ISessionService
): Promise<InlineQueryResultArticle[]> {
  const result: InlineQueryResultArticle[] = [];
  const currentSession = await database.findById(userId);
  if (!currentSession) {
    throw new Error("Session not found");
  }

  const mainMessage = session.getMainMessage();

  for(const key in object) {
    const value = object[key];

    const formattedTitle = currentSession[type] === value 
      ? `(Выбрано) ${key}`
      : key;

    const messageText = mainMessage.messageId < 0 
      ? Menu.createErrorMenu()
      : `Вы успешно изменили значение ${type} на ${key}`

    result.push({
      type: "article",
      id: value,
      title: formattedTitle,
      input_message_content: {
        message_text: messageText,
      }
    });
  }

  return result;
}