import { IDatabase } from "./database.interface";
import mongoose from "mongoose";

export class DatabaseService implements IDatabase {
  private connectUrl: string;
  
  constructor(connectUrl: string) {
    this.connectUrl = connectUrl;
  }

  async connect(): Promise<void> {
    await mongoose.connect(this.connectUrl)
      .then(() => console.log("Successfully connected to database"))
      .catch(() => {
        throw new Error("Failed to connect to the database");
      });
  }
}