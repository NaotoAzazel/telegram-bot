import fs from "fs";
import { Command } from "../commands/command.class";
import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { ISessionService } from "../service/session.interface";
import { ICommandManager } from "./commands.interface";

export class CommandManager implements ICommandManager {
  private commands: Command[] = [];

  constructor(
    private bot: Telegraf<IBotContext>, 
    private session: ISessionService
  ) { }

  async load(commandsFolderPath: string): Promise<void> {
    const regex = /\w+\.(?!class)\w+\.js$/;
    const files = await fs.promises.readdir(commandsFolderPath);
    if(!files) {
      throw new Error("Cant find command files");
    }

    const sortedFiles = files.filter((file) => regex.test(file));
    for(const file of sortedFiles) {
      const { default: CommandClass } = await import(`../../${commandsFolderPath}/${file}`);
      const commandInstance = new CommandClass(this.bot, this.session);

      this.commands.push(commandInstance);
    }
  }

  handleCommands(): void {
    for(const command of this.commands) {
      command.handle();
    }
  }
}