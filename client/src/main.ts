import {
  CacheType,
  Client,
  Events,
  GatewayIntentBits,
  Interaction,
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from 'discord.js';
import { configDotenv } from 'dotenv';
//import { loadCommands } from './util/loadCommands.js';
import { Command, CommandGroup } from './types/commands.js';
import './commands/events/thread/index.js';
import { loadCommands } from './util/loadCommands.js';

configDotenv();
const token = process.env.DISCORD_TOKEN;

if (!token) throw new Error('DISCORD_TOKEN is not set');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
let commandMap: Map<String, CommandGroup | Command> = new Map();

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (i: Interaction<CacheType>) => {
  //console.log((commandMap.get('thread') as CommandGroup).builder);
});

async function main() {
  const commandMeta = await loadCommands();

  await new REST()
    .setToken(token as string)
    .put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID as string,
        process.env.GUILD_ID as string
      ),
      {
        body: commandMeta.jsonData,
      }
    );

  commandMap = commandMeta.commandMap;

  await client.login(token);
}

main().then((err) => console.error(err));
