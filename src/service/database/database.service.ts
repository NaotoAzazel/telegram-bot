import { IDatabase, UpdateFields } from "./database.interface";
import mongoose from "mongoose";
import SessionModel from "../../schema/session.schema";
import { SessionData } from "../../context/context.interface";

export class DatabaseService implements IDatabase {
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

  async updateById(fields: UpdateFields, id: number): Promise<void> {
    try {
      await SessionModel.findOneAndUpdate({ id }, fields, { new: true });
    } catch(err) {
      throw new Error(err as string);
    }
  }

  async connect(connectUrl: string): Promise<void> {
    await mongoose.connect(connectUrl)
      .then(() => console.log("Successfully connected to database"))
      .catch(() => {
        throw new Error("Failed to connect to the database");
      });
  }
}