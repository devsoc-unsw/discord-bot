import {
  SlashCommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from 'discord.js';
import { CommandGroup } from '../types/commands';

export enum CommandGroupBuilder {
  SLASH_COMMAND,
  SUBCOMMAND_GROUP,
}

export function generateCommandGroup(
  name: string,
  description: string,
  type: CommandGroupBuilder
): CommandGroup {
  const b =
    type === CommandGroupBuilder.SLASH_COMMAND
      ? new SlashCommandBuilder()
      : new SlashCommandSubcommandGroupBuilder();

  b.setName(name).setDescription(description);

  return new CommandGroup(b, name, description);
}
