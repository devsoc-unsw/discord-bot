import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js';

const execute = async (input: ChatInputCommandInteraction) => {
  console.log('Event Create Command triggered!');
};

export default {
  data: new SlashCommandSubcommandBuilder()
    .setName('create')
    .setDescription('Create a new event')
    .addStringOption((option) =>
      option
        .setRequired(true)
        .setName('event')
        .setDescription('Name of the event')
    ),
  excute: execute,
};
