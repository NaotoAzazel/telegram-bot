import { SessionData } from "../context/context.interface";

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
    return (
      "Меню фильтров\n\n" +
      "Выбери фильтры и жми \"Искать по фильтру\`\n\n" +
      "Выбрано:\n" +
      `📈 Рейтинг: ${session?.minRating} - ${session?.maxRating}\n` +
      `📅 Начиная с года: ${session?.startYear}\n` +
      `📆 До года: ${session?.endYear}\n` +
      `🎵 Жанр: ${session?.genre || "Все"}\n` +
      `🔀 Тип: ${session?.type || "Все"}\n`
    );
  }

  createErrorMenu(): string {
    return "Это сообщение больше не доступно для взимодействия с ним, отправьте команду /start для начала роботы."
  }
}