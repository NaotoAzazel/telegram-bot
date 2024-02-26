import { DefaultValues } from "../schema/session.schema";

type Genre = {
  id: number;
  name: string;
}

type ProductionCompany = {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

type ProductionCountry = {
  iso_3166_1: string;
  name: string;
}

type SpokenLanguage = {
  english_name: string;
  iso_639_1: string;
  name: string;
}

type Movie = {
  adult: boolean;
  id: number;
  title: string;
  vote_average: number;
  vote_count: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  release_date: string;
  video: boolean;
  poster_path: string;
  backdrop_path: string;
}

export type MovieDetail = Movie & {
  belongs_to_collection: any;
  budget: number;
  genres: Genre[];
  homepage: string;
  imdb_id: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
}

type Result = {
  page: number;
  total_pages: number;
  total_results: number;
}

export type SearchMovie = Movie & {
  genre_ids: number[];
}

export type SearchResult = Result & {
  results: SearchMovie[];
}

export interface IMovieApi {
  search(): Promise<SearchResult>;
  searchByParams(values: DefaultValues, id: number): Promise<SearchResult>;
  searchById(id: string): Promise<MovieDetail>;
  searchByTitle(title: string): Promise<SearchResult>;
}