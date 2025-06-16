import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { CommandBuilder, generateCommand } from '../../util/generateCommand.js';

const execute = async (input: ChatInputCommandInteraction) => {
  console.log('Event Create Command triggered!');
};

const cmd = generateCommand(
  'create',
  'Create a new event',
  execute,
  CommandBuilder.SUBCOMMAND
);

cmd.builder.addStringOption((option) =>
  option.setRequired(true).setName('event').setDescription('Name of the event')
);

export default cmd;
