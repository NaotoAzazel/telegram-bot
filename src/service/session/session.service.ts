import { MainMessage } from "../../types";
import { GenreItem } from "../../types/movie-api";
import { ISessionService } from "./session.interface";

export class SessionService implements ISessionService {
  private genres: GenreItem[] = [];
  private lastMessageId: number = -1;
  private mainMessage: MainMessage = { messageId: -1, chatId: -1 };
  private static instance: SessionService | null = null;

  constructor() {
    SessionService.instance = this;
  }

  static getInstance(): SessionService {
    if(!SessionService.instance) {
      SessionService.instance = new SessionService();
    }

    return SessionService.instance;
  }

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