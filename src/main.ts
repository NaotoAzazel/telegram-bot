import { Telegraf } from "telegraf";
import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";
import { IBotContext } from "./context/context.interface";
import { DatabaseService } from "./service/database/database.service";
import { ISessionService } from "./service/session/session.interface";
import { SessionService } from "./service/session/session.service";
import { ICommandManager } from "./handler/commands.interface";
import { CommandManager } from "./handler/commands.class";
import { MovieApiService } from "./service/movie-api/movie-api.service";
import { ExpressService } from "./service/express/express.service";

class Bot {
  bot: Telegraf<IBotContext>;
  commands: ICommandManager;
  session: ISessionService;
  
  constructor(private readonly configService: IConfigService) {
    this.bot = new Telegraf<IBotContext>(this.configService.get("BOT_TOKEN"));
    this.session = new SessionService();
    this.commands = new CommandManager(this.bot, this.session);
  }

  async start() {
    await this.commands.load("dist/commands");
    this.commands.handleCommands();

    await DatabaseService.connect(this.configService.get("MONGO_URL"));

    const movieApi = new MovieApiService();
    this.session.setGenres(await movieApi.getGenres());

    this.bot.launch();
    console.log("Bot successfully start");
  }
}

const bot = new Bot(new ConfigService());
bot.start();

const express = new ExpressService();
express.connect();
express.basicRequest();