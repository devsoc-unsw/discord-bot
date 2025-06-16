import { readImmediateFiles } from '../../../util/loadCommands';
import path from 'path';
import {
  CommandGroupBuilder,
  generateCommandGroup,
} from '../../../util/generateCommandGroup';
import { CommandGroup } from '../../../types/commands';

async function initialize(): Promise<CommandGroup> {
  const group = generateCommandGroup(
    'thread',
    'manages threads',
    CommandGroupBuilder.SUBCOMMAND_GROUP
  );

  await readImmediateFiles(__dirname, group);
  return group;
}

export default initialize();
