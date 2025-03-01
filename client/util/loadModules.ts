import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';

function getSubdirectories(directoryPath: string): string[] {
  return fs
    .readdirSync(directoryPath)
    .filter((item) => fs.statSync(path.join(directoryPath, item)).isDirectory())
    .map((item) => path.join(directoryPath, item));
}

export async function loadCommandsInDir(
  directoryPath: string,
  builder: SlashCommandBuilder | SlashCommandSubcommandGroupBuilder,
) {
  const items = fs.readdirSync(directoryPath);

  for (const item of items) {
    const itemPath = path.join(directoryPath, item);
    const stat = fs.statSync(itemPath);

    if (!stat.isDirectory() && item !== 'index.ts' && item.endsWith('.ts')) {
      let moduleSpecifier = path.join('../', itemPath);
      moduleSpecifier = moduleSpecifier.replace(/\.(ts|tsx)$/, '');
      //console.log(moduleSpecifier);
      let module = await import(moduleSpecifier);
      builder.addSubcommand(
        module.default.data as SlashCommandSubcommandBuilder,
      );
    }
  }
}

export async function loadSubcommandGroupsInDir(
  directoryPath: string,
  builder: SlashCommandBuilder,
) {
  const subDirs = getSubdirectories(directoryPath);

  for (const subDir of subDirs) {
    const indexPath = path.join(subDir, 'index.ts');
    let moduleSpecifier = path.join('../', indexPath);
    if (!moduleSpecifier.startsWith('.')) {
      moduleSpecifier = `./${moduleSpecifier}`;
    }

    moduleSpecifier = moduleSpecifier.replace(/\.(ts|tsx)$/, '');

    if (fs.existsSync(indexPath)) {
      let module = await import(moduleSpecifier);
      console.log(moduleSpecifier);
      builder.addSubcommandGroup(
        module.default.data as SlashCommandSubcommandGroupBuilder,
      );
    }
  }
}
