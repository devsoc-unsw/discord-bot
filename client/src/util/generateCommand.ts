import {
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { Command } from '../types/commands';

export enum CommandBuilder {
  SLASH_COMMAND,
  SUBCOMMAND,
}

export function generateCommand(
  name: string,
  description: string,
  execute: (
    interaction: ChatInputCommandInteraction,
    client: Client
  ) => Promise<void>,
  type: CommandBuilder
): Command {
  const b =
    type === CommandBuilder.SLASH_COMMAND
      ? new SlashCommandBuilder()
      : new SlashCommandSubcommandBuilder();

  b.setName(name).setDescription(description);

  return new Command(b, name, description, execute);
}
