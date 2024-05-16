import express, { Express, Request, Response } from "express";
import { IExpress } from "./express.interface";

export class ExpressService implements IExpress {
  private app: Express = express();
  private port = process.env.PORT || 3000;
  
  connect() {
    this.app.listen(this.port, () => {
      console.log(`[server]: Server is running at http://localhost:${this.port}`)
    });
  }

  basicRequest() {
    this.app.get("/", (req: Request, res: Response) => {
      res.send("Server is running");
    });
  }
}