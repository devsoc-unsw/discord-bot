import {
  CacheType,
  Client,
  Events,
  GatewayIntentBits,
  Interaction,
  REST,
  Routes,
} from 'discord.js';
import { configDotenv } from 'dotenv';
import { Command, CommandGroup } from './types/commands.js';
import './commands/events/thread/index.js';
import { loadCommands } from './util/loadCommands.js';

configDotenv();

function validateEnv() {
  const requiredEnvVars = ['DISCORD_TOKEN', 'CLIENT_ID', 'GUILD_ID'];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
}

async function registerCommands(
  token: string
): Promise<Map<String, CommandGroup | Command>> {
  const commandMeta = await loadCommands();

  await new REST()
    .setToken(token)
    .put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID!,
        process.env.GUILD_ID!
      ),
      {
        body: commandMeta.jsonData,
      }
    );

  return commandMeta.commandMap;
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
let commandMap: Map<String, CommandGroup | Command> = new Map();

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  if (process.env.TEST_MODE === 'true') {
    client.destroy();
    console.log('Validated login is functional.');
    process.exit(0);
  }
});

client.on(Events.InteractionCreate, async (i: Interaction<CacheType>) => {
  /***
   * TODO!
   */
});

async function main() {
  try {
    validateEnv();
    const token = process.env.DISCORD_TOKEN!;

    if (process.env.TEST_MODE !== 'true') {
      commandMap = await registerCommands(token);
    }

    await client.login(token);
  } catch (error) {
    console.error('Failed to start the bot:', error);
    process.exit(1);
  }
}

await main();
