import { Telegraf } from "telegraf";
import { IBotContext, SessionData } from "../context/context.interface";
import { convertIdToGenre } from "../libs/utils";
import { MovieDetail } from "../service/movie-api.interface";

export default new class Menu {
  createStartMenuText(): string {
    return "Для начала роботы с ботом нажмите ниже";
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

    return `🆔 ${session.id}\n🕗 Дата регистрации ${formattedDate}\n\nПриятного поиска!`;
  }

  createFilterMenuText(session: SessionData): string {
    const genre = !session.genre.length 
      ? "Все"
      : convertIdToGenre(session.genre).join(", ");
      
    return (
      "Меню фильтров\n\n" +
      "Выбери фильтры и жми \"Искать по фильтру\`\n\n" +
      "Выбрано:\n" +
      `📈 Рейтинг: ${session.minRating} - ${session?.maxRating}\n` +
      `📅 Начиная с года: ${session.startYear}\n` +
      `📆 До года: ${session.endYear}\n` +
      `🎵 Жанр: ${genre}\n`
    );
  }

  createErrorMenu(): string {
    return "Это сообщение больше не доступно для взимодействия с ним, отправьте команду /start для начала роботы.";
  }

  createMovieMenu(fields: MovieDetail): string {
    const genres: string[] = fields.genres.map((genre) => genre.name);

    return (
      `${fields.title}\n\n` +
      `Жанр: ${genres.join(", ")}\n` +
      `Рейтинг: ${fields.vote_average || "Не найдено"}\n` +
      `Вышел: ${fields.status}\n` +
      `Описание:\n${fields.overview}`
    );
  }

  updateMenuText(bot: Telegraf<IBotContext>, userId: number, data: "menu" | "filter" | "movie", id?: string): void {
    const uniqueNumber: number = new Date().getTime();
    bot.handleUpdate({
      update_id: uniqueNumber,
      callback_query: {
        id: id || uniqueNumber.toString(),
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