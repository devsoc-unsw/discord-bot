import { SlashCommandSubcommandGroupBuilder } from 'discord.js';
import { readImmediateFiles } from '../../../util/loadCommands.js';
import path from 'path';
import { CommandGroup } from '../../../types/commands.js';
import {
  CommandGroupBuilder,
  generateCommandGroup,
} from '../../../util/generateCommandGroup.js';

const group = generateCommandGroup(
  'thread',
  'manages threads',
  CommandGroupBuilder.SUBCOMMAND_GROUP
);

await readImmediateFiles(path.dirname(import.meta.url), group);

export default group;
