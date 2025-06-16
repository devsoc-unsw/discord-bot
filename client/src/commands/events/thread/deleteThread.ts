import { ChatInputCommandInteraction } from 'discord.js';
import { CommandBuilder, generateCommand } from '../../../util/generateCommand';

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
