import {
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from 'discord.js';
import { readdir, stat } from 'fs/promises';
import path, { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Command, CommandGroup } from '../types/commands.js';
import assert from 'assert';

type loadCommandReturn =
  | SlashCommandBuilder
  | SlashCommandSubcommandGroupBuilder
  | null;

/***
 *
 *
 * probs needs a slashcommandbuilder at the root.
 *
 * if we're at depth = 1, then we create a subcommand
 *
 * slash command builder is the top level. i.e. commands/events
 *
 *  slashcommandbuilder -> subcommands
 *                      -> subcommandGroups -> subcommands
 *
 */

export async function loadCommands(
  commandData: Map<String, Command | CommandGroup>
): Promise<RESTPostAPIChatInputApplicationCommandsJSONBody[]> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const commandsDir = join(__dirname, '..', 'commands');

  const modules = await readdir(commandsDir);

  const res: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

  for (const module of modules) {
    const slashCommand = await loadCommandsFromDir(
      path.join(commandsDir, module),
      1,
      commandData
    );
    if (slashCommand) res.push((slashCommand as SlashCommandBuilder).toJSON());
  }

  return res;
}

async function loadCommandsFromDir(
  dir: string,
  depth: number,
  commandData: Map<String, Command | CommandGroup>
): Promise<loadCommandReturn> {
  const items = await readdir(dir);
  const builder = builderRoot(depth);
  const dirName = path.basename(dir);

  const commandGroup: CommandGroup = {
    name: dirName,
    description: '',
    subCommands: new Map(),
    subGroups: new Map(),
  };

  for (const item of items) {
    const itemPath = join(dir, item);
    const stats = await stat(itemPath);

    if (stats.isDirectory()) {
      const subGroup = await loadCommandsFromDir(
        itemPath,
        depth + 1,
        commandData
      );
      if (subGroup) {
        (builder as SlashCommandBuilder).addSubcommandGroup(
          subGroup as SlashCommandSubcommandGroupBuilder
        );
        const subgroupName = path.basename(itemPath);
        const subgroup = commandData.get(subgroupName) as CommandGroup;
        if (subgroup) {
          commandGroup.subGroups.set(subgroupName, subgroup);
          if (depth === 1) {
            commandData.delete(subgroupName);
          }
        }
      }
    } else if (item === 'group.ts') {
      const groupData = await import(itemPath);
      if (groupData.default) {
        builder
          ?.setName(groupData.default.name)
          .setDescription(groupData.default.description);
        commandGroup.name = groupData.default.name;
        commandGroup.description = groupData.default.description;
      }
    } else if (item.endsWith('.ts') && item !== 'group.ts') {
      const command = await import(itemPath);
      if (command.default) {
        builder?.addSubcommand(command.default.data);
        const cmd: Command = {
          data: command.default.data,
          execute: command.default.execute,
        };
        const cmdName = (command.default.data as SlashCommandSubcommandBuilder)
          .name;
        commandGroup.subCommands.set(cmdName, cmd);
      }
    }
  }

  commandData.set(commandGroup.name, commandGroup);

  return builder;
}

function builderRoot(depth: Number): loadCommandReturn {
  switch (depth) {
    case 1:
      return new SlashCommandBuilder();
    case 2:
      return new SlashCommandSubcommandGroupBuilder();
  }

  return null;
}
