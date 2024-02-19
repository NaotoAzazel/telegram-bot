import { SessionData } from "../context/context.interface";
import SessionModel from "../schema/session";
import { ISessionService } from "./session.interface";

export type MainMessage = {
  messageId: number;
  chatId: number;
}

export class SessionService implements ISessionService {
  private lastMessageId: number = -1;
  private mainMessage: MainMessage = { messageId: -1, chatId: -1 };

  async create(id: number): Promise<void> {
    try {
      await SessionModel.create({ id });
    } catch(err) {
      throw new Error(err as string);
    }
  }

  async findById(id: number): Promise<SessionData | null> {
    try {
      const session = await SessionModel.findOne({ id });
      return session;
    } catch(err) {
      throw new Error(err as string);
    }
  }

  async updateById(field: keyof SessionData, value: string | number, id: number): Promise<void> {
    try {
      const update = { [field]: value };
      await SessionModel.findOneAndUpdate({ id }, update, { new: true });
    } catch(err) {
      throw new Error(err as string);
    }
  }

  setLastMessageId(messageId: number) {
    this.lastMessageId = messageId;
  }

  getLastMessageId(): number {
    return this.lastMessageId;
  }

  setMainMessage({ messageId, chatId }: MainMessage) {
    this.mainMessage = { messageId, chatId };
  }

  getMainMessage(): MainMessage {
    return this.mainMessage;
  }
}