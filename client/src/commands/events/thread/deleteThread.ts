import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { Command } from '../../../types/commands.js';

export const execute = async (input: ChatInputCommandInteraction) => {
  console.log('thread add executed');
};

export default {
  data: new SlashCommandSubcommandBuilder()
    .setName('delete')
    .setDescription('Delete a thread')
    .addStringOption((option) =>
      option
        .setRequired(true)
        .setName('event')
        .setDescription('Name of the event')
        .setChoices([
          {
            name: 'test2',
            value: 'valueTest',
          },
        ])
    ),
  execute: execute,
} as Command;
