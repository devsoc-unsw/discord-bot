import {
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from 'discord.js';
import { readdir, stat } from 'fs/promises';
import path, { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Command } from '../types/commands.js';
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

export async function loadCommands(): Promise<
  RESTPostAPIChatInputApplicationCommandsJSONBody[]
> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const commandsDir = join(__dirname, '..', 'commands');

  //onsole.log(commandsDir);

  const modules = await readdir(commandsDir);

  const res: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

  for (const module of modules) {
    const slashCommand = await loadCommandsFromDir(
      path.join(commandsDir, module),
      1
    );
    if (slashCommand) res.push((slashCommand as SlashCommandBuilder).toJSON());
  }

  return res;
}

async function loadCommandsFromDir(
  dir: string,
  depth: number
): Promise<loadCommandReturn> {
  const items = await readdir(dir);

  let builder = builderRoot(depth);

  for (const item of items) {
    const path = join(dir, item);
    //console.log(path);
    const stats = await stat(path);

    if (stats.isDirectory()) {
      const subCommands = await loadCommandsFromDir(path, depth + 1);
      assert(builder !== null);
      (builder as SlashCommandBuilder).addSubcommandGroup(
        subCommands as SlashCommandSubcommandGroupBuilder
      );
    } else if (item === 'group.ts') {
      const groupData = await import(path);
      if (groupData.default) {
        builder
          ?.setName(groupData.default.name)
          .setDescription(groupData.default.description);
      }
    } else if (item !== 'group.ts' && item.endsWith('.ts')) {
      const command = await import(path);
      if (command.default) {
        builder?.addSubcommand(command.default.data);
      }
    }
  }

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
