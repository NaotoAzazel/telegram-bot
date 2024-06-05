import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { convertIdToGenre } from "../libs/utils";
import { MovieDetail } from "../types/movie-api";
import { SessionData } from "../types";

export default new (class Menu {
  createStartMenuText(): string {
    return "Для початку роботи с ботом натисніть нижче";
  }

  createMainMenuText(session: SessionData): string {
    const date: Date = new Date(session.createdAt);
    date.setHours(date.getHours());

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    const formattedDate = new Intl.DateTimeFormat("ru-RU", options).format(
      date
    );

    return `🆔 ${session.id}\n🕗 Дата реєстрації ${formattedDate}\n\nПриємного пошуку!`;
  }

  createFilterMenuText(session: SessionData): string {
    const genre = !session.genre.length
      ? "Усі"
      : convertIdToGenre(session.genre).join(", ");

    return (
      "Меню фільтрів\n\n" +
      "Вибери фільтри і тисни \"Шукати за фільтром\"\n\n" +
      "Обрано:\n" +
      `📈 Рейтинг: ${session.minRating} - ${session?.maxRating}\n` +
      `📅 Починаючи з року: ${session.startYear}\n` +
      `📆 До року: ${session.endYear}\n` +
      `🎵 Жанр: ${genre}\n`
    );
  }

  createErrorMenu(): string {
    return "Це повідомлення більше не доступне для взаємодії з ним, надішліть команду /start для початку роботи.";
  }

  createMovieMenu(fields: MovieDetail): string {
    const genres: string[] = fields.genres.map((genre) => genre.name);

    return (
      `${fields.title}\n\n` +
      `Жанр: ${genres.join(", ")}\n` +
      `Рейтинг: ${fields.vote_average || "Не найдено"}\n` +
      `Вийшов: ${fields.status}\n` +
      `Опис:\n${fields.overview}`
    );
  }

  updateMenuText(
    bot: Telegraf<IBotContext>,
    userId: number,
    data: "menu" | "filter" | "movie",
    id?: string
  ): void {
    const uniqueNumber: number = new Date().getTime();
    bot.handleUpdate({
      update_id: uniqueNumber,
      callback_query: {
        id: id || uniqueNumber.toString(),
        from: {
          id: userId,
          is_bot: false,
          first_name: uniqueNumber.toString(),
        },
        message: undefined,
        chat_instance: uniqueNumber.toString(),
        data,
      },
    });
  }
})();
