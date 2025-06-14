import {
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js';

export interface Command {
  data: SlashCommandSubcommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface CommandGroup {
  name: string;
  description: string;
}
