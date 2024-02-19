import { SessionData } from "../context/context.interface";
import { MainMessage } from "./session.service";

export interface ISessionService {
  create(id: number): Promise<void>;
  findById(id: number): Promise<SessionData | null>;
  updateById(field: keyof SessionData, value: string | number, id: number): Promise<void>;
  setLastMessageId(messageId: number): void;
  getLastMessageId(): number;
  setMainMessage({ messageId, chatId }: MainMessage): void;
  getMainMessage(): MainMessage;
}