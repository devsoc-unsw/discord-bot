import { SlashCommandSubcommandBuilder } from 'discord.js';

export const execute = async () => {
  console.log('thread add executed');
};

export default {
  data: new SlashCommandSubcommandBuilder()
    .setName('add')
    .setDescription('Add a thread')
    .addStringOption((option) =>
      option
        .setRequired(true)
        .setName('event')
        .setDescription('Name of the event')
        .setChoices([
          {
            name: 'test',
            value: 'valueTest',
          },
        ]),
    ),
  execute: execute,
};
