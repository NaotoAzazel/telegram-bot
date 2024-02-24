import { IConfigService } from "../config/config.interface";
import { ConfigService } from "../config/config.service";
import { IMovieApi, MoviesData, ExtendMovieItem } from "./movie-api.interface";
import axios from "axios";
import { SessionData } from "../context/context.interface";

export class MovieApiService implements IMovieApi {
  private rapidApiHost: string;
  private rapidApiKey: string;

  constructor() {
    const configService: IConfigService = new ConfigService();
    this.rapidApiHost = configService.get("RAPID_API_HOST");
    this.rapidApiKey = configService.get("RAPID_API_KEY");
  }

  async search(): Promise<MoviesData> {
    try {
      const options = {
        method: "GET",
        url: `https://${this.rapidApiHost}/advancedsearch`,
        params: {
          sort: "highestrated"
        },
        headers: {
          "X-RapidAPI-Key": this.rapidApiKey,
          "X-RapidAPI-Host": this.rapidApiHost
        }
      };
  
      const response = await axios.request(options);
      return response.data;
    } catch(err) {
      throw new Error(err as string);
    }
  }

  async searchByParams(values: SessionData): Promise<MoviesData> {
    try {
      const options = {
        method: "GET",
        url: `https://${this.rapidApiHost}/advancedsearch`,
        params: {
          start_year: values.startYear,
          end_year: values.endYear,
          min_imdb: values.minRating,
          max_imdb: values.maxRating,
          genre: values.genre,
          type: values.type,
          sort: "highestrated",
          page: "1"
        },
        headers: {
          "X-RapidAPI-Key": this.rapidApiKey,
          "X-RapidAPI-Host": this.rapidApiHost
        }
      };
  
      const response = await axios.request(options);
      return response.data;
    } catch(err) {
      throw new Error(err as string);
    }
  }

  async searchById(id: string): Promise<ExtendMovieItem> {
    try {
      const options = {
        method: "GET",
        url: `https://${this.rapidApiHost}/gettitleDetails`,
        params: {
          imdbid: id
        },
        headers: {
          "X-RapidAPI-Key": this.rapidApiKey,
          "X-RapidAPI-Host": this.rapidApiHost
        }
      };
  
      const response = await axios.request(options);
      return response.data;
    } catch(err) {
      throw new Error(err as string);
    }
  }

  async searchByTitle(title: string = ""): Promise<MoviesData> {
    try {
      const options = {
        method: "GET",
        url: `https://${this.rapidApiHost}/search`,
        params: {
          title,
          page: "1"
        },
        headers: {
          "X-RapidAPI-Key": this.rapidApiKey,
          "X-RapidAPI-Host": this.rapidApiHost
        }
      };
  
      const response = await axios.request(options);
      return response.data;
    } catch(err) {
      throw new Error(err as string);
    }
  }
}  