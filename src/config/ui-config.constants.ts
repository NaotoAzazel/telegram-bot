export type ButtonItem = {
  name: string;
  value: string;
}

export type MenuItem = {
  switchToInline?: ButtonItem[];
  buttons?: ButtonItem[]; 
}

type ButtonsConfig = {
  startMenu: MenuItem,
  mainMenu: MenuItem,
  filterMenu: MenuItem,
  movieMenu: MenuItem
}

export type GenreItem = {
  "id": number;
  "name": string;
}
export const GENRES: GenreItem[] = [
  {
    "id": 28,
    "name": "боевик"
  },
  {
    "id": 12,
    "name": "приключения"
  },
  {
    "id": 16,
    "name": "мультфильм"
  },
  {
    "id": 35,
    "name": "комедия"
  },
  {
    "id": 80,
    "name": "криминал"
  },
  {
    "id": 99,
    "name": "документальный"
  },
  {
    "id": 18,
    "name": "драма"
  },
  {
    "id": 10751,
    "name": "семейный"
  },
  {
    "id": 14,
    "name": "фэнтези"
  },
  {
    "id": 36,
    "name": "история"
  },
  {
    "id": 27,
    "name": "ужасы"
  },
  {
    "id": 10402,
    "name": "музыка"
  },
  {
    "id": 9648,
    "name": "детектив"
  },
  {
    "id": 10749,
    "name": "мелодрама"
  },
  {
    "id": 878,
    "name": "фантастика"
  },
  {
    "id": 10770,
    "name": "телевизионный фильм"
  },
  {
    "id": 53,
    "name": "триллер"
  },
  {
    "id": 10752,
    "name": "военный"
  },
  {
    "id": 37,
    "name": "вестерн"
  }
];

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