import { CacheType, ChatInputCommandInteraction, Client } from 'discord.js';
import { Command, CommandGroup } from '../types/commands';

export async function resolveCommand(
  i: ChatInputCommandInteraction<CacheType>,
  client: Client,
  commandMap: Map<String, CommandGroup | Command>
): Promise<void> {
  console.log(i.commandName);
  const topLevelCommand = commandMap.get(i.commandName)!;

  if (topLevelCommand instanceof Command) {
    await topLevelCommand.execute(i, client);
    return;
  }

  const subCommandGroupName = i.options.getSubcommandGroup();
  const subCommandName = i.options.getSubcommand();

  if (!subCommandGroupName) {
    await topLevelCommand.subCommands.get(subCommandName)!.execute(i, client);
    return;
  }

  const subGroup = topLevelCommand.subGroups.get(subCommandGroupName)!;
  await subGroup.subCommands.get(subCommandName)!.execute(i, client);
}
