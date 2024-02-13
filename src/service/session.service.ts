import { SessionData } from "../context/context.interface";
import SessionModel from "../schema/session";
import { ISessionService } from "./session.interface";

export class SessionService implements ISessionService {
  async create(id: string): Promise<void> {
    if(!id) {
      throw new Error("No id specified");
    }
    try {
      await SessionModel.create({ id });
    } catch(err) {
      throw new Error(err as string);
    }
  }

  async findById(id: string): Promise<SessionData | null> {
    if(!id) {
      throw new Error("No id specified");
    }
    try {
      const session = await SessionModel.findOne({ id });
      return session;
    } catch(err) {
      throw new Error(err as string);
    }
  }
}