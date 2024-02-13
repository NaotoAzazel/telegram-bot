import { Telegraf } from "telegraf";
import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";
import { IBotContext } from "./context/context.interface";
import { Command } from "./commands/command.class";
import { StartCommand } from "./commands/start.command";
import { IDatabase } from "./service/database.interface";
import { DatabaseService } from "./service/database.service";
import { ISessionService } from "./service/session.interface";
import { SessionService } from "./service/session.service";
import { FilterCommand } from "./commands/filter.command";
import { MenuCommand } from "./commands/menu.command";

class Bot {
  bot: Telegraf<IBotContext>;
  commands: Command[] = [];
  database: IDatabase;
  session: ISessionService;
  
  constructor(private readonly configService: IConfigService) {
    this.bot = new Telegraf<IBotContext>(this.configService.get("BOT_TOKEN"));
    this.database = new DatabaseService(this.configService.get("MONGO_URL"));
    this.session = new SessionService();
  }

  start() {
    this.commands = [
      new StartCommand(this.bot, this.session), 
      new FilterCommand(this.bot, this.session), 
      new MenuCommand(this.bot, this.session)
    ];
    for(const command of this.commands) {
      command.handle();
    }
    this.database.connect();
    this.bot.launch();
    console.log("Bot successfully start");
  }
}

const bot = new Bot(new ConfigService());
bot.start()