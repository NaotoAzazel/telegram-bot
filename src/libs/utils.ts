import { InlineQueryResultArticle } from "telegraf/typings/core/types/typegram";
import { KeyValueItem } from "../config/ui-config.constants";
import { MovieApiService } from "../service/movie-api.service";
import { SessionData } from "../context/context.interface";
import { IMovieApi, MovieItem } from "../service/movie-api.interface";
import { TYPES } from "../config/ui-config.constants";

export async function generateNumberInlineQuery(
  start: number,
  end: number,
  step: number,
  type: "minRating" | "maxRating" | "startYear" | "endYear",
  session: SessionData
): Promise<InlineQueryResultArticle[]> {
  const result: InlineQueryResultArticle[] = [];

  for(let i = start; i <= end; i += step) {
    let formattedId: number | string = i;
    let formattedTitle: string;

    switch(type) {
      case "startYear":
      case "endYear": {
        formattedTitle = session[type] === formattedId
          ? `(Выбрано) ${formattedId}`
          : `${formattedId}`;
        break;
      }

      case "maxRating":
      case "minRating": {
        formattedId = formattedId.toFixed(1);
        formattedTitle = session[type].toFixed(1) === formattedId
          ? `(Выбрано) ${formattedId}`
          : `${formattedId}`;
        break;
      }
    }

    result.push({
      type: "article",
      id: formattedId.toString(),
      title: formattedTitle,
      input_message_content: {
        message_text: `Вы успешно изменили значение ${type} на ${formattedId}`,
      }
    });
  }

  return result;
}

export async function generateTextInlineQuery(
  type: "genre" | "type",
  object: KeyValueItem,
  session: SessionData
): Promise<InlineQueryResultArticle[]> {
  const result: InlineQueryResultArticle[] = [];

  for(const key in object) {
    const value = object[key];

    const formattedTitle = session[type] === value 
      ? `(Выбрано) ${key}`
      : key;

    result.push({
      type: "article",
      id: value,
      title: formattedTitle,
      input_message_content: {
        message_text: `Вы успешно изменили значение ${type} на ${key}`,
      }
    });
  }

  return result;
}

export async function generateMovieInlineQuery(
  options: {
    searchType: "search" | "searchByParams" | "searchByTitle";
    id?: number;
    fields?: SessionData;
    title?: string;
  }
): Promise<InlineQueryResultArticle[]> {
  const { searchType, id, fields, title } = options;
  const result: InlineQueryResultArticle[] = [];
  const apiService: IMovieApi = new MovieApiService();
  let movies: MovieItem[] = [];

  switch(searchType) {
    case "search": {
      movies = (await apiService.search()).results;
      console.log("🚀 ~ movies:", movies)
      break;
    }

    case "searchByParams": {
      movies = (await apiService.searchByParams(fields!, id!)).results;
      break;
    }

    case "searchByTitle": {
      movies = (await apiService.searchByTitle(title!)).results;
      break;
    }
  }

  if(!movies.length) {
    result.push({
      type: "article",
      id: "not found",
      title: "Ничего не найдено",
      description: "Попробуйте ввести другой запрос или изменить фильтры",
      input_message_content: {
        message_text: "text",
      },
    })
    return result;
  }

  for(let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    const description
      = `${findKeyByValue(TYPES, movie.type)} | ${movie.imdbrating || "Рейтинг не найден"} | ${movie.released}\n${movie.genre.join(", ")}`;

    result.push({
      type: "article",
      id: movie.imdbid,
      title: movie.title,
      input_message_content: {
        message_text: "text",
      },
      description,
      thumbnail_url: movie.imageurl?.length ? movie.imageurl[0] : "https://demofree.sirv.com/nope-not-here.jpg",
      thumbnail_height: 32,
      thumbnail_width: 32
    });
  }

  return result;
}

export const findKeyByValue = (object: KeyValueItem, value: string | number) => {
  return Object.keys(object).find(key => object[key] === value);
};