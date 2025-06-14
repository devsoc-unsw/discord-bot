import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { Command } from '../../../types/commands';

export const execute = async (input: ChatInputCommandInteraction) => {
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
        ])
    ),
  execute: execute,
} as Command;
