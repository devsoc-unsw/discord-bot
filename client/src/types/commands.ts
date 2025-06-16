import {
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from 'discord.js';

export interface Command {
  builder: SlashCommandBuilder | SlashCommandSubcommandBuilder;
  name: string;
  description: string;
  execute: (
    interaction: ChatInputCommandInteraction,
    client: Client
  ) => Promise<void>;
}

export interface CommandGroup {
  builder: SlashCommandBuilder | SlashCommandSubcommandGroupBuilder;
  name: string;
  description: string;
  subCommands: Map<String, Command>;
  subGroups: Map<String, CommandGroup>;
}
