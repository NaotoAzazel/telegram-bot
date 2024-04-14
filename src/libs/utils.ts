import { InlineQueryResultArticle } from "telegraf/typings/core/types/typegram";
import { MovieApiService } from "../service/movie-api/movie-api.service";
import { IMovieApi } from "../service/movie-api/movie-api.interface";
import { movieConfig } from "../config/movie";
import { SessionService } from "../service/session/session.service";
import { GenreItem, MovieDetail, SearchMovie } from "../types/movie-api";
import { SessionData } from "../types";

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
  type: "genre",
  genres: GenreItem[],
  session: SessionData
): Promise<InlineQueryResultArticle[]> {
  const result: InlineQueryResultArticle[] = [];

  for(const genre of genres) {
    const formattedTitle = session.genre.indexOf(genre.id) !== -1
      ? `(Выбрано) ${genre.name}`
      : genre.name;

    result.push({
      type: "article",
      id: genre.id.toString(),
      title: formattedTitle,
      input_message_content: {
        message_text: `Вы успешно изменили значение ${type} на ${genre.name}`,
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
  let movies: SearchMovie[] | MovieDetail[] = [];

  switch(searchType) {
    case "search": {
      movies = (await apiService.search()).results;
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
    const description = 
      `${movie.release_date} | ` + 
      `${movie.vote_average} | ` + 
      `${movie.genre_ids?.length && convertIdToGenre(movie.genre_ids).join(", ")}`;

    result.push({
      type: "article",
      id: `selected_${movie.id}`,
      title: movie.title,
      input_message_content: {
        message_text: "text",
      },
      description,
      thumbnail_url: 
        movie.poster_path ? `${movieConfig.baseImageUrl}${movie.poster_path}` : movieConfig.notFoundImageUrl,
      thumbnail_height: 32,
      thumbnail_width: 32
    });
  }

  return result;
}

export const convertIdToGenre = (ids: number[]): string[] => {
  const result: string[] = [];
  const genres = SessionService.getInstance().getGenres();

  for (const genreId of ids) { 
    const genre = genres.find(genre => genre.id === genreId);
    if(genre) result.push(genre.name);
  }
  return result;
}