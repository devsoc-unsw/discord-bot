import { Client, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
import { configDotenv } from 'dotenv';
import { loadCommands } from './util/loadCommands.js';

configDotenv();

const token = process.env.DISCORD_TOKEN;

if (!token) {
  throw new Error('DISCORD_TOKEN is not set');
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

async function main() {
  await new REST()
    .setToken(token as string)
    .put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID as string,
        process.env.GUILD_ID as string
      ),
      {
        body: await loadCommands(),
      }
    );

  await client.login(token);
}

await main();
