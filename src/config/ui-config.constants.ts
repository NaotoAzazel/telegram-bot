import { MenuItem } from "../types/ui"

type ButtonsConfig = {
  startMenu: MenuItem,
  mainMenu: MenuItem,
  filterMenu: MenuItem,
  movieMenu: MenuItem
}

export const BUTTONS: ButtonsConfig = {
  startMenu: {
    buttons: [{ name: "📃 Відкрити меню", value: "menu" }],
  },
  mainMenu: {
    buttons: [{ name: "Фільтр", value: "filter" }],
    switchToInline: [{ name: "Почати пошук", value: "" }],
  },
  filterMenu: {
    switchToInline: [
      { name: "Рейтинг від", value: "filter_minRating" },
      { name: "Рейтинг до", value: "filter_maxRating" },
      { name: "Рік від", value: "filter_startYear" },
      { name: "Рік до", value: "filter_endYear" },
      { name: "Вибрати жанр", value: "filter_genre" },
      { name: "Шукати за фільтром", value: "filter" },
    ],
    buttons: [
      { name: "Скинути", value: "reset" },
      { name: "Назад", value: "menu" },
    ],
  },
  movieMenu: {
    buttons: [{ name: "Назад", value: "redirect_menu" }],
  },
};