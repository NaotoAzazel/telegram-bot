import { InlineQueryResultArticle } from "telegraf/typings/core/types/typegram";
import Menu from "./config/menu.class";
import { ISessionService } from "./service/session.interface";
import { KeyValueItem } from "./config/genres";

export async function generateNumberInlineQuery(
  start: number,
  end: number,
  step: number,
  userId: number,
  type: "minRating" | "maxRating" | "startYear" | "endYear",
  session: ISessionService
): Promise<InlineQueryResultArticle[]> {
  const result: InlineQueryResultArticle[] = [];
  const currentSession = await session.findById(userId);
  if (!currentSession) {
    throw new Error("Session not found");
  }

  const mainMessage = session.getMainMessage();

  for(let i = start; i <= end; i += step) {
    const formattedId = Number.isInteger(i) ? i.toString() : i.toFixed(1);
    const formattedTitle = Number(currentSession[type]) === Number(formattedId)
      ? `(Выбрано) ${formattedId}`
      : formattedId;

    const messageText = mainMessage.messageId < 0 
      ? Menu.createErrorMenu()
      : `Вы успешно изменили значение ${type} на ${formattedId}`

    result.push({
      type: "article",
      id: formattedId,
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
  session: ISessionService
): Promise<InlineQueryResultArticle[]> {
  const result: InlineQueryResultArticle[] = [];
  const currentSession = await session.findById(userId);
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