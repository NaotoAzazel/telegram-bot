import { GenreItem } from "../movie-api/movie-api.interface";
import { MainMessage } from "./session.service";

export interface ISessionService {
  setLastMessageId(messageId: number): void;
  getLastMessageId(): number;
  setMainMessage({ messageId, chatId }: MainMessage): void;
  getMainMessage(): MainMessage;
  setGenres(genres: GenreItem[]): void;
  getGenres(): GenreItem[];
}