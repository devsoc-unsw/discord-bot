import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { Command } from '../../../types/commands.js';
import {
  CommandBuilder,
  generateCommand,
} from '../../../util/generateCommand.js';

export const execute = async (input: ChatInputCommandInteraction) => {
  console.log('thread add executed');
};

const cmd = generateCommand(
  'delete',
  'Delete a thread',
  execute,
  CommandBuilder.SUBCOMMAND
);

export default cmd;
