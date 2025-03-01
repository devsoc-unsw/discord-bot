import { SlashCommandSubcommandGroupBuilder } from 'discord.js';
import { loadCommandsInDir } from '../../../util/loadModules';

const threadSubGroup = new SlashCommandSubcommandGroupBuilder()
  .setName('thread')
  .setDescription('Manage threads');

await loadCommandsInDir('./commands/events/threads', threadSubGroup);

export default {
  data: threadSubGroup,
};
