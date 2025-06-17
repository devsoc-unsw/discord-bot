import {
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { readdir, stat } from 'fs/promises';
import path, { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Command, CommandGroup } from '../types/commands';
import assert from 'assert';
import { Stats } from 'fs';

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

  const dirName = __dirname;
  const commandsDir = join(dirName, '..', 'commands');

  const modules = await readdir(commandsDir);
  const jsonData: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

  for (const module of modules) {
    const modulePath = join(
      commandsDir,
      module,
      process.env.NODE_ENV === 'development' ? 'index.ts' : 'index.js'
    );
    const moduleExports = await import(modulePath);
    const slashCmdOrGroup = await moduleExports.default;
    const name = slashCmdOrGroup.name;
    jsonData.push(slashCmdOrGroup.builder.toJSON());
    commandMap.set(name, slashCmdOrGroup);
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

    if (checkFile(item, stats)) {
      const moduleExports = await import(itemPath);
      const commandData = await moduleExports.default;
      assert(commandData, `No default export found in ${itemPath}`);
      const def = commandData;
      commandGroup.subCommands.set(def.name, def);
      commandGroup.builder.addSubcommand(
        def.builder as SlashCommandSubcommandBuilder
      );
    } else if (stats.isDirectory()) {
      const moduleExports = await import(itemPath);
      const groupData = await moduleExports.default;
      commandGroup.subGroups.set(groupData.name, groupData);
      if (commandGroup.builder instanceof SlashCommandBuilder) {
        const slashCmdBuilder = commandGroup.builder as SlashCommandBuilder;
        slashCmdBuilder.addSubcommandGroup(groupData.builder);
      }
    }
  }
}

function checkFile(item: string, stats: Stats): boolean {
  const nodeEnv = process.env.NODE_ENV;
  assert(nodeEnv);

  const ext = nodeEnv === 'development' ? '.ts' : '.js';

  const regex = /^(?!index\.(ts|js)$)(?!.*\.d\.(ts|js)$).*\.((ts|js))$/;

  return stats.isFile() && regex.test(item) && item.endsWith(ext);
}
