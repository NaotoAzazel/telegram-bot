import { MainMessage } from "../../types";
import { GenreItem } from "../../types/movie-api";

export interface ISessionService {
  setLastMessageId(messageId: number): void;
  getLastMessageId(): number;
  setMainMessage({ messageId, chatId }: MainMessage): void;
  getMainMessage(): MainMessage;
  setGenres(genres: GenreItem[]): void;
  getGenres(): GenreItem[];
}