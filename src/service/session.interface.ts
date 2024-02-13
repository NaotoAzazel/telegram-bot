import { SessionData } from "../context/context.interface";

export interface ISessionService {
  create(id: string): Promise<void>;
  findById(id: string): Promise<SessionData | null>
}