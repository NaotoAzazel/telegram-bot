export interface ICommandManager {
  load(commandsFolderPath: string): Promise<void>;
  handleCommands(): void;
}