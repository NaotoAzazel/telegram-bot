import { MenuItem } from "../types/ui"

type ButtonsConfig = {
  startMenu: MenuItem,
  mainMenu: MenuItem,
  filterMenu: MenuItem,
  movieMenu: MenuItem
}

export const BUTTONS: ButtonsConfig = {
  startMenu: {
    buttons: [
      { name: "📃 Открыть меню", value: "menu" }
    ],
  },
  mainMenu: {
    buttons: [
      { name: "Фильтр", value: "filter" },
    ],
    switchToInline: [
      { name: "Начать поиск", value: "" },
    ]
  },
  filterMenu: {
    switchToInline: [
      { name: "Рейтинг от", value: "filter_minRating" },
      { name: "Рейтинг до", value: "filter_maxRating" },
      { name: "Год от", value: "filter_startYear" },
      { name: "Год до", value: "filter_endYear" },
      { name: "Выбрать жанр", value: "filter_genre" },
      { name: "Искать по фильтру", value: "filter" }
    ],
    buttons: [
      { name: "Сбросить", value: "reset" },
      { name: "Назад", value: "menu" }
    ]
  },
  movieMenu: {
    buttons: [
      { name: "Назад", value: "redirect_menu" }
    ]
  }
}