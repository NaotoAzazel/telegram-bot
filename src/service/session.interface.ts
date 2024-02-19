import { SessionData } from "../context/context.interface";
import { DefaultValues } from "../schema/session.schema";
import { MainMessage } from "./session.service";

export type UpdateFields = Partial<Record<keyof DefaultValues, DefaultValues[keyof DefaultValues]>>;

export interface ISessionService {
  create(id: number): Promise<void>;
  findById(id: number): Promise<SessionData | null>;
  updateById(fields: UpdateFields, id: number): Promise<void>;
  setLastMessageId(messageId: number): void;
  getLastMessageId(): number;
  setMainMessage({ messageId, chatId }: MainMessage): void;
  getMainMessage(): MainMessage;
}