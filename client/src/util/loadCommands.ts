import {
  RESTPostAPIApplicationCommandsJSONBody,
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

type builderTypes = SlashCommandBuilder | SlashCommandSubcommandGroupBuilder;

type loadCommandData = {
  builder: builderTypes;
  commandData: Command | CommandGroup;
};

/***
 *
 * Loads all the commands for the Discord Bot.
 *
 * Returns a @CommandMeta type, which has all the command meta data.
 *
 * @CommandMeta - contains two fields, jsonData and commandMap. jsonData has the raw discord.js format.
 *
 */
export type CommandMeta = {
  jsonData: RESTPostAPIChatInputApplicationCommandsJSONBody[];
  commandMap: Map<String, Command | CommandGroup>;
};

export async function loadCommands(): Promise<CommandMeta> {
  const commandMap = new Map();

  const fileName = fileURLToPath(import.meta.url);
  const dirName = dirname(fileName);
  const commandsDir = join(dirName, '..', 'commands');

  const modules = await readdir(commandsDir);
  const jsonData: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

  for (const module of modules) {
    const modulePath = join(commandsDir, join(module, 'index.ts'));
    const slashCmdOrGroup = await import(modulePath);
    const name = slashCmdOrGroup.default.name;
    jsonData.push(slashCmdOrGroup.default.builder.toJSON());
    commandMap.set(name, slashCmdOrGroup.default);
  }

  return {
    jsonData,
    commandMap,
  };
}

export async function readImmediateFiles(
  dir: string,
  commandGroup: CommandGroup
): Promise<void> {
  const dirPath = dir.startsWith('file://') ? fileURLToPath(dir) : dir;
  const items = await readdir(dirPath);

  for (const item of items) {
    const itemPath = join(dirPath, item);
    const stats = await stat(itemPath);

    if (stats.isFile() && item.endsWith('.ts') && item !== 'index.ts') {
      const commandData = await import(itemPath);
      assert(commandData.default);
      const def = commandData.default;
      //console.log(def);
      commandGroup.subCommands.set(def.name, def.builder);
      commandGroup.builder.addSubcommand(
        def.builder as SlashCommandSubcommandBuilder
      );
    } else if (stats.isDirectory()) {
      const groupData = (await import(itemPath)).default;
      commandGroup.subGroups.set(groupData.name, groupData);
      if (commandGroup.builder instanceof SlashCommandBuilder) {
        const slashCmdBuilder = commandGroup.builder as SlashCommandBuilder;
        slashCmdBuilder.addSubcommandGroup(groupData.builder);
      }
    }
  }
}
