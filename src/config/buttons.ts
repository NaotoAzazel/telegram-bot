type ButtonItem = {
  name: string;
  value: string;
}

type MenuItem = {
  switchToInline?: ButtonItem[];
  buttons?: ButtonItem[]; 
}

type ButtonsConfig = {
  startMenu: MenuItem,
  mainMenu: MenuItem,
  filterMenu: MenuItem
}

export const BUTTONS: ButtonsConfig = {
  startMenu: {
    buttons: [
      { name: "📃 Открыть меню", value: "menu" }
    ]
  },
  mainMenu: {
    buttons: [
      { name: "Фильтр", value: "filter" },
      { name: "Начать поиск", value: "search" },
    ]
  },
  filterMenu: {
    switchToInline: [
      { name: "Рейтинг от", value: "filter_minRating" },
      { name: "Рейтинг до", value: "filter_maxRating" },
      { name: "Год от", value: "filter_startYear" },
      { name: "Год до", value: "filter_endYear" },
      { name: "Выбрать тип", value: "filter_type" },
      { name: "Выбрать жанр", value: "filter_genre" },
      { name: "Искать по фильтру", value: "filter" }
    ],
    buttons: [
      { name: "Сбросить", value: "reset" },
      { name: "Назад", value: "menu" }
    ]
  },
}

