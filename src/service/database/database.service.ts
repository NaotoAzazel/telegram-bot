import mongoose from "mongoose";
import SessionModel, { DefaultValues } from "../../schema/session.schema";
import { SessionData } from "../../context/context.interface";

export type UpdateFields = Partial<Record<keyof DefaultValues, DefaultValues[keyof DefaultValues]>>;

export class DatabaseService {
  private static instance: DatabaseService | null = null;
  private connectUrl: string;

  private constructor(connectUrl: string) {
    this.connectUrl = connectUrl;
  }

  static async create(id: number): Promise<SessionData> {
    if(!DatabaseService.instance) {
      throw new Error("No connection to database found");
    }

    try {
      return await SessionModel.create({ id });
    } catch(err) {
      throw new Error(err as string);
    }
  }

  static async findById(id: number): Promise<SessionData> {
    if(!DatabaseService.instance) {
      throw new Error("No connection to database found");
    }

    try {
      let session: SessionData | null = await SessionModel.findOne({ id });
      if(!session) session = await DatabaseService.create(id);

      return session;
    } catch(err) {
      throw new Error(err as string);
    }
  }

  static async updateById(fields: UpdateFields, id: number): Promise<void> {
    if(!DatabaseService.instance) {
      throw new Error("No connection to database found");
    }

    try {
      let session: SessionData | null = await SessionModel.findOneAndUpdate({ id }, fields, { new: true });
      if(session) session = await DatabaseService.create(id);
    } catch(err) {
      throw new Error(err as string);
    }
  }

  static async connect(connectUrl: string): Promise<DatabaseService> {
    try {
      if(!DatabaseService.instance) {
        await mongoose.connect(connectUrl);
        DatabaseService.instance = new DatabaseService(connectUrl);
      }

      await mongoose.disconnect();
      await mongoose.connect(connectUrl);

      DatabaseService.instance.connectUrl = connectUrl;
      return DatabaseService.instance;
    } catch(err) {
      throw new Error(err as string);
    }
  }
}