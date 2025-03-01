import { SlashCommandBuilder } from 'discord.js';
import {
  loadCommandsInDir,
  loadSubcommandGroupsInDir,
} from '../../util/loadModules';

const eventsCommands = new SlashCommandBuilder()
  .setName('event')
  .setDescription('The events command');

// src/index.ts => calls events/index.ts, loads in first level commands
// src/index.ts should have an internal function that loads in the first level commands (i.e. commands in the directory.)
// commands/events/index.ts needs to call events/threads/index.ts, loads in second level commands.

await loadCommandsInDir('./commands/events', eventsCommands);
await loadSubcommandGroupsInDir('./commands/events', eventsCommands);

export default {
  data: eventsCommands,
};
