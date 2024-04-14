import { DefaultValues } from "../../types";
import { GenreItem, MovieDetail, SearchResult } from "../../types/movie-api";

export interface IMovieApi {
  search(): Promise<SearchResult>;
  searchByParams(values: DefaultValues, id: number): Promise<SearchResult>;
  searchById(id: string): Promise<MovieDetail>;
  searchByTitle(title: string): Promise<SearchResult>;
  getGenres(): Promise<GenreItem[]>;
}