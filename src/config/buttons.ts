type ButtonItem = {
  name: string;
  value: string;
}

type ButtonsConfig = {
  startMenu: ButtonItem[],
  mainMenu: ButtonItem[],
  filterMenu: ButtonItem[]
}

export const BUTTONS: ButtonsConfig = {
  startMenu: [
    { name: "📃 Открыть меню", value: "menu" }
  ],
  mainMenu: [
    { name: "Фильтр", value: "filter" },
    { name: "Начать поиск", value: "search" }
  ],
  filterMenu: [
    { name: "Рейтинг от", value: "minRating" },
    { name: "Рейтинг до", value: "maxRating" },
    { name: "Год от", value: "startYear" },
    { name: "Год до", value: "endYear" },
    { name: "Выбрать тип", value: "type" },
    { name: "Выбрать жанр", value: "genre" },
    { name: "Сбросить", value: "reset" },
    { name: "Искать по фильтру", value: "searchByFilter" },
    { name: "Назад", value: "back" }
  ]
}

