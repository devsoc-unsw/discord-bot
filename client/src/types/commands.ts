import {
  ChatInputCommandInteraction,
  Client,
  SlashCommandSubcommandBuilder,
} from 'discord.js';

export interface Command {
  data: SlashCommandSubcommandBuilder;
  execute: (
    interaction: ChatInputCommandInteraction,
    client: Client
  ) => Promise<void>;
}

export interface CommandGroup {
  name: string;
  description: string;
  subCommands: Map<String, Command>;
  subGroups: Map<String, CommandGroup>;
}
