import {
  ChatInputCommandInteraction,
  Client,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { Command } from '../../../types/commands.js';
import {
  CommandBuilder,
  generateCommand,
} from '../../../util/generateCommand.js';

export const execute = async (
  _input: ChatInputCommandInteraction,
  _client: Client
) => {
  console.log('thread add executed');
};

const commandObj = generateCommand(
  'add',
  'Add a thread',
  execute,
  CommandBuilder.SUBCOMMAND
);

export default commandObj;
