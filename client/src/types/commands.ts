import {
  CacheType,
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from 'discord.js';

export class Command {
  constructor(
    public builder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
    public name: string,
    public description: string,
    public execute: (
      interaction: ChatInputCommandInteraction<CacheType>,
      client: Client
    ) => Promise<void>
  ) {}
}

export class CommandGroup {
  public subCommands: Map<String, Command>;
  public subGroups: Map<String, CommandGroup>;

  constructor(
    public builder: SlashCommandBuilder | SlashCommandSubcommandGroupBuilder,
    public name: string,
    public description: string
  ) {
    this.subCommands = new Map();
    this.subGroups = new Map();
  }
}
