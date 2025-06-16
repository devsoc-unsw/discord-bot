import { SlashCommandBuilder } from 'discord.js';
import { CommandGroup } from '../../types/commands.js';
import {
  CommandGroupBuilder,
  generateCommandGroup,
} from '../../util/generateCommandGroup.js';
import { readImmediateFiles } from '../../util/loadCommands.js';
import { dirname } from 'path';

const group = generateCommandGroup(
  'event',
  'Manages the events commands modules',
  CommandGroupBuilder.SLASH_COMMAND
);

await readImmediateFiles(dirname(import.meta.url), group);

export default group;
