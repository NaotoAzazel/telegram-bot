import { IConfigService } from "../../config/config.interface";
import { ConfigService } from "../../config/config.service";
import { IMovieApi } from "./movie-api.interface";
import axios from "axios";
import { movieConfig } from "../../config/movie";
import { GenreItem, MovieDetail, SearchResult } from "../../types/movie-api";
import { SessionData } from "../../types";

export class MovieApiService implements IMovieApi {
  private accessToken: string;
  private basicParams = { language: movieConfig.language };

  constructor() {
    const configService: IConfigService = new ConfigService();
    this.accessToken = configService.get("TMDB_ACCESS_TOKEN");
  }

  async search(): Promise<SearchResult> {
    try {
      const options = {
        method: "GET",
        url: `https://api.themoviedb.org/3/trending/movie/week`,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${this.accessToken}`
        },
        params: this.basicParams
      };
  
      const response = await axios(options);
      return response.data;
    } catch(err) {
      throw new Error(err as string);
    }
  }

  async searchByParams(values: SessionData): Promise<SearchResult> {
    try {
      const params = {
        ...this.basicParams,
        include_adult: movieConfig.includeAdult,
        include_video: false,
        page: 1,
        "release_date.gte": `${values.startYear}-01-01`,
        "release_date.lte": `${values.endYear}-12-31`,
        sort_by: "popularity.desc",
        "vote_average.gte": values.minRating,
        "vote_average.lte": values.maxRating,
        "with_genres": values.genre.join(", ")
      };
      const options = {
        method: "GET",
        url: `https://api.themoviedb.org/3/discover/movie`,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${this.accessToken}`
        },
        params
      };
  
      const response = await axios(options);
      return response.data;
    } catch(err) {
      throw new Error(err as string);
    }
  }

  async searchById(id: string): Promise<MovieDetail> {
    try {
      const options = {
        method: "GET",
        url: `https://api.themoviedb.org/3/movie/${id}`,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${this.accessToken}`
        },
        params: this.basicParams
      };
  
      const response = await axios(options);
      return response.data;
    } catch(err) {
      throw new Error(err as string);
    }
  }

  async searchByTitle(title: string = ""): Promise<SearchResult> {
    try {
      const searchString = encodeURIComponent(title);
      const params = {
        ...this.basicParams,
        query: searchString,
        include_adult: movieConfig.includeAdult,
        page: 1 
      };
      const options = {
        method: "GET",
        url: `https://api.themoviedb.org/3/search/movie`,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${this.accessToken}`
        },
        params
      };
  
      const response = await axios(options);
      return response.data;
    } catch(err) {
      throw new Error(err as string);
    }
  }

  async getGenres(): Promise<GenreItem[]> {
    try {
      const options = {
        method: "GET",
        url: "https://api.themoviedb.org/3/genre/movie/list",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${this.accessToken}`
        },
        params: this.basicParams
      };

      const response = await axios(options);
      return response.data.genres;
    } catch(err) {
      throw new Error(err as string);
    }
  }
}  