import { DefaultValues } from "../schema/session.schema";

export type MovieItem = {
  imageurl: string[];
  genre: string[];
  imdbid: string;
  title: string;
  imdbrating: number;
  released: number;
  type: string;
  synopsis: string;
}

interface StreamingAvailability {
  [country: string]: {
    [platform: string]: string;
  }[];
}

export type ExtendMovieItem = MovieItem & {
  runtime: string;
  language: string[];
  streaminAvailability: StreamingAvailability;
}

export type MoviesData = {
  page: number;
  results: MovieItem[];
}

export interface IMovieApi {
  search(): Promise<MoviesData>;
  searchByParams(values: DefaultValues, id: number): Promise<MoviesData>;
  searchById(id: string): Promise<ExtendMovieItem>;
  searchByTitle(title: string): Promise<MoviesData>;
}