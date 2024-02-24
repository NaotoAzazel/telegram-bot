import { Telegraf } from "telegraf";
import { IBotContext, SessionData } from "../context/context.interface";
import { GENRES, TYPES } from "./ui-config.constants";
import { findKeyByValue } from "../utils";

export default new class Menu {
  createStartMenuText(): string {
    return "Для начала роботы с ботом нажмите ниже"
  }

  createMainMenuText(session: SessionData): string {
    const date = session.createdAt;
    date.setHours(date.getHours());

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    };
    const formattedDate = new Intl.DateTimeFormat("ru-RU", options).format(date);

    return `🆔 ${session.id}\n🕗 Дата регистрации ${formattedDate}\n\nПриятного поиска!`
  }

  createFilterMenuText(session: SessionData): string {
    const genre = session.genre 
      ? findKeyByValue(GENRES, session.genre)
      : "Все";

    const type = session.type
      ? findKeyByValue(TYPES, session.type)
      : "Все";

    return (
      "Меню фильтров\n\n" +
      "Выбери фильтры и жми \"Искать по фильтру\`\n\n" +
      "Выбрано:\n" +
      `📈 Рейтинг: ${session.minRating} - ${session?.maxRating}\n` +
      `📅 Начиная с года: ${session.startYear}\n` +
      `📆 До года: ${session.endYear}\n` +
      `🎵 Жанр: ${genre}\n` +
      `🔀 Тип: ${type}\n`
    );
  }

  createErrorMenu(): string {
    return "Это сообщение больше не доступно для взимодействия с ним, отправьте команду /start для начала роботы."
  }

  updateMenuText(bot: Telegraf<IBotContext>, userId: number, data: "menu" | "filter"): void {
    const uniqueNumber: number = new Date().getTime();
    bot.handleUpdate({
      update_id: uniqueNumber,
      callback_query: {
        id: uniqueNumber.toString(),
        from: { 
          id: userId, 
          is_bot: false, 
          first_name: uniqueNumber.toString()
        }, 
        message: undefined,
        chat_instance: uniqueNumber.toString(),
        data
      }
    });
  }
}