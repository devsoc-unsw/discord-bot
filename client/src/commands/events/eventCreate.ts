import { ChatInputCommandInteraction, Client } from 'discord.js';
import { CommandBuilder, generateCommand } from '../../util/generateCommand';

const execute = async (
  _input: ChatInputCommandInteraction,
  _client: Client
) => {
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
