import { GenreItem } from "../movie-api/movie-api.interface";
import { ISessionService } from "./session.interface";

export type MainMessage = {
  messageId: number;
  chatId: number;
}

export class SessionService implements ISessionService {
  private genres: GenreItem[] = [];
  private lastMessageId: number = -1;
  private mainMessage: MainMessage = { messageId: -1, chatId: -1 };

  setLastMessageId(messageId: number) {
    this.lastMessageId = messageId;
  }

  getLastMessageId(): number {
    return this.lastMessageId;
  }

  setMainMessage({ messageId, chatId }: MainMessage) {
    this.mainMessage.chatId = chatId;
    this.mainMessage.messageId = messageId;
  }

  getMainMessage(): MainMessage {
    return this.mainMessage;
  }

  setGenres(genres: GenreItem[]): void {
    this.genres = genres;
  }

  getGenres(): GenreItem[] {
    return this.genres;
  }
}