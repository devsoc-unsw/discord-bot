import { CommandGroup } from '../../types/commands.js';
import {
  CommandGroupBuilder,
  generateCommandGroup,
} from '../../util/generateCommandGroup.js';
import { readImmediateFiles } from '../../util/loadCommands';

async function initialize(): Promise<CommandGroup> {
  const group = generateCommandGroup(
    'event',
    'Manages the events commands modules',
    CommandGroupBuilder.SLASH_COMMAND
  );
  await readImmediateFiles(__dirname, group);
  return group;
}

export default initialize();
