import { SessionData } from "../context/context.interface";
import { DefaultValues } from "../schema/session.schema";

export type UpdateFields = Partial<Record<keyof DefaultValues, DefaultValues[keyof DefaultValues]>>;

export interface IDatabase {
  create(id: number): Promise<void>;
  findById(id: number): Promise<SessionData | null>;
  updateById(fields: UpdateFields, id: number): Promise<void>;
  connect(connectUrl: string): void;
}