import { SessionData } from "../context/context.interface";
import { MainMessage } from "./session.service";

export interface ISessionService {
  create(id: string): Promise<void>;
  findById(id: string): Promise<SessionData | null>;
  updateById(field: keyof SessionData, value: string, id: string): Promise<void>;
  setLastMessageId(messageId: number): void;
  getLastMessageId(): number;
  setMainMessage({ messageId, chatId }: MainMessage): void;
  getMainMessage(): MainMessage;
}