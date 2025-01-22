import assert from 'node:assert/strict'
import {
  Client,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
} from 'discord.js'
import { configDotenv } from 'dotenv'
import { DBEvent, dbEvents } from './db'

configDotenv()

await loadCommands()

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
client.once(Events.ClientReady, (c) => {
  console.log(`Logged in and serving as: ${c.user.tag}`)
  console.log(`\\    /\\\n )  ( ')\n(  /  )\n \\(__)|`)
})

client.on(Events.InteractionCreate, async (i) => {
  if (i.isChatInputCommand()) {
    if (i.commandName == 'event') {
      if (i.options.getSubcommandGroup() === null) {
        if (i.options.getSubcommand() === 'create') {
          await i.deferReply({ flags: 'Ephemeral' })

          const name = i.options.getString('event', true)
          const existing = await dbEvents.findOne({ name })
          if (existing !== null) {
            await i.editReply('Error: event already exists')
            return
          }

          const unretired = await dbEvents.countDocuments({ retired: false })
          if (unretired >= 25) {
            await i.editReply(
              'Error: too many active events, please retire or delete some',
            )
            return
          }

          await dbEvents.insertOne(new DBEvent(name, [], [], false))
          await loadCommands()
          await i.editReply('Event created')
        } else if (i.options.getSubcommand() === 'delete') {
          await i.deferReply({ flags: 'Ephemeral' })

          const name = i.options.getString('event', true)
          const existing = await dbEvents.findOne({ name })
          if (existing === null) {
            await i.editReply('Error: event does not exist')
            return
          }

          await dbEvents.deleteOne({ name })
          await loadCommands()
          await i.editReply('Event deleted')
        } else if (i.options.getSubcommand() === 'retire') {
          await i.deferReply({ flags: 'Ephemeral' })

          const name = i.options.getString('event', true)
          const existing = await dbEvents.findOne({ name })
          if (existing === null) {
            await i.editReply('Error: event does not exist')
            return
          } else if (existing.retired) {
            await i.editReply('Error: event is already retired')
            return
          }

          await dbEvents.updateOne({ name }, { $set: { retired: true } })
          await loadCommands()
          await i.editReply('Event retired')
        } else if (i.options.getSubcommand() === 'unretire') {
          await i.deferReply({ flags: 'Ephemeral' })

          const name = i.options.getString('event', true)
          const existing = await dbEvents.findOne({ name })
          if (existing === null) {
            await i.editReply('Erorr: event does not exist')
            return
          } else if (!existing.retired) {
            await i.editReply('Error: event is not retired')
            return
          }

          const unretired = await dbEvents.countDocuments({ retired: false })
          if (unretired >= 25) {
            await i.editReply(
              'Error: too many active events, please retire or delete some',
            )
            return
          }

          await dbEvents.updateOne({ name }, { $set: { retired: false } })
          await loadCommands()
          await i.editReply('Event unretired')
        } else if (i.options.getSubcommand() === 'list') {
          await i.deferReply()

          const events = await dbEvents.find({ retired: false }).toArray()
          if (events.length === 0) {
            await i.editReply('No events')
            return
          }

          await i.editReply({
            embeds: events.map((event) => {
              const ports = new Map<string, string[]>()
              for (const [user, port] of event.users) {
                if (!ports.has(port)) ports.set(port, [])
                ports.get(port)?.push(user)
              }

              return new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(event.name)
                .addFields(
                  ...(event.users.length !== 0
                    ? Array.from(ports).map(([port, users]) => ({
                        name: port,
                        value: users.map((u) => `<@${u}>`).join('\n'),
                      }))
                    : [
                        {
                          name: 'Users',
                          value: 'No users',
                        },
                      ]),
                  {
                    name: 'Threads',
                    value:
                      event.threads.map((t) => `<#${t}>`).join('\n') ||
                      'No threads',
                  },
                )
            }),
          })
        } else if (i.options.getSubcommand() === 'listretired') {
          await i.deferReply()

          const events = await dbEvents.find({ retired: true }).toArray()
          if (events.length === 0) {
            await i.editReply('No events')
            return
          }

          await i.editReply({
            embeds: events.map((event) => {
              const ports = new Map<string, string[]>()
              for (const [user, port] of event.users) {
                if (!ports.has(port)) ports.set(port, [])
                ports.get(port)?.push(user)
              }

              return new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle(event.name)
                .addFields(
                  ...(event.users.length !== 0
                    ? Array.from(ports).map(([port, users]) => ({
                        name: port,
                        value: users.map((u) => `<@${u}>`).join('\n'),
                      }))
                    : [
                        {
                          name: 'Users',
                          value: 'No users',
                        },
                      ]),
                  {
                    name: 'Threads',
                    value:
                      event.threads.map((t) => `<#${t}>`).join('\n') ||
                      'No threads',
                  },
                )
            }),
          })
        } else if (i.options.getSubcommand() === 'ping') {
          await i.deferReply({ flags: 'Ephemeral' })

          const name = i.options.getString('event', true)
          const port = i.options.getString('port', true)

          const event = await dbEvents.findOne({ name })
          if (event === null) {
            await i.editReply('Error: event not found')
            return
          }

          const toPing = event.users.filter(([_, p]) => p === port)
          if (toPing.length === 0) {
            await i.editReply('Error: no users in the event has that role')
            return
          }

          await i.deleteReply()
          await i.followUp(toPing.map(([id]) => `<@${id}>`).join('\n'))
        }
      } else if (i.options.getSubcommandGroup() === 'user') {
        if (i.options.getSubcommand() === 'add') {
          await i.deferReply({ flags: 'Ephemeral' })

          const name = i.options.getString('event', true)
          const user = i.options.getUser('user', true)
          const port = i.options.getString('port', true)

          const event = await dbEvents.findOne({ name })
          if (event === null) {
            await i.editReply('Error: event not found')
            return
          }

          await dbEvents.updateOne(
            { name },
            { $push: { users: [user.id, port] } },
          )
          await i.editReply('User added')
        }
      } else if (i.options.getSubcommandGroup() === 'thread') {
        if (i.options.getSubcommand() === 'add') {
          await i.deferReply({ flags: 'Ephemeral' })

          const name = i.options.getString('event', true)
          const thread = i.options.getChannel('thread', true)

          const event = await dbEvents.findOne({ name })
          if (event === null) {
            await i.editReply('Error: event not found')
            return
          }

          await dbEvents.updateOne({ name }, { $push: { threads: thread.id } })
          await i.editReply('Thread added')
        }
      }
    }
  }
})

client.login(process.env.DISCORD_TOKEN)

async function loadCommands() {
  const events = await dbEvents.find({ retired: false }).toArray()

  assert(process.env.DISCORD_TOKEN)
  assert(process.env.CLIENT_ID)
  assert(process.env.GUILD_ID)
  assert(process.env.DB_URI)

  await new REST()
    .setToken(process.env.DISCORD_TOKEN)
    .put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID,
      ),
      {
        body: [
          new SlashCommandBuilder()
            .setName('event')
            .setDescription('The events command')
            .addSubcommand((sub) =>
              sub
                .setName('create')
                .setDescription('Create a new event')
                .addStringOption((option) =>
                  option
                    .setRequired(true)
                    .setName('event')
                    .setDescription('Name of the event'),
                ),
            )
            .addSubcommand((sub) =>
              sub
                .setName('delete')
                .setDescription('Delete an event')
                .addStringOption((option) =>
                  option
                    .setRequired(true)
                    .setName('event')
                    .setDescription('Name of the event')
                    .setChoices(
                      ...events.map((e) => ({ name: e.name, value: e.name })),
                    ),
                ),
            )
            .addSubcommand((sub) =>
              sub
                .setName('retire')
                .setDescription('Retire an event')
                .addStringOption((option) =>
                  option
                    .setRequired(true)
                    .setName('event')
                    .setDescription('Name of the event')
                    .setChoices(
                      ...events.map((e) => ({ name: e.name, value: e.name })),
                    ),
                ),
            )
            .addSubcommand((sub) =>
              sub
                .setName('unretire')
                .setDescription('Unretire an event')
                .addStringOption((option) =>
                  option
                    .setRequired(true)
                    .setName('event')
                    .setDescription('Name of the event'),
                ),
            )
            .addSubcommand((sub) =>
              sub.setName('list').setDescription('List events'),
            )
            .addSubcommand((sub) =>
              sub.setName('listretired').setDescription('List retired events'),
            )
            .addSubcommand((sub) =>
              sub
                .setName('ping')
                .setDescription('Ping involved users with the port')
                .addStringOption((option) =>
                  option
                    .setRequired(true)
                    .setName('event')
                    .setDescription('Name of the event')
                    .setChoices(
                      ...events.map((e) => ({ name: e.name, value: e.name })),
                    ),
                )
                .addStringOption((option) =>
                  option
                    .setRequired(true)
                    .setName('port')
                    .setDescription('Port the user belongs to')
                    .addChoices(
                      { name: 'HR', value: 'HR' },
                      {
                        name: 'Marketing',
                        value: 'Marketing',
                      },
                      {
                        name: 'Events',
                        value: 'Events',
                      },
                      {
                        name: 'Other',
                        value: 'Other',
                      },
                    ),
                ),
            )
            .addSubcommandGroup((group) =>
              group
                .setName('user')
                .setDescription('Manage users')
                .addSubcommand((sub) =>
                  sub
                    .setName('add')
                    .setDescription('Add a user')
                    .addStringOption((option) =>
                      option
                        .setRequired(true)
                        .setName('event')
                        .setDescription('Name of the event')
                        .setChoices(
                          ...events.map((e) => ({
                            name: e.name,
                            value: e.name,
                          })),
                        ),
                    )
                    .addUserOption((option) =>
                      option
                        .setRequired(true)
                        .setName('user')
                        .setDescription('User to add'),
                    )
                    .addStringOption((option) =>
                      option
                        .setRequired(true)
                        .setName('port')
                        .setDescription('Port the user belongs to')
                        .addChoices(
                          { name: 'HR', value: 'HR' },
                          {
                            name: 'Marketing',
                            value: 'Marketing',
                          },
                          {
                            name: 'Events',
                            value: 'Events',
                          },
                          {
                            name: 'Other',
                            value: 'Other',
                          },
                        ),
                    ),
                ),
            )
            .addSubcommandGroup((group) =>
              group
                .setName('thread')
                .setDescription('Manage threads')
                .addSubcommand((sub) =>
                  sub
                    .setName('add')
                    .setDescription('Add a thread')
                    .addStringOption((option) =>
                      option
                        .setRequired(true)
                        .setName('event')
                        .setDescription('Name of the event')
                        .setChoices(
                          ...events.map((e) => ({
                            name: e.name,
                            value: e.name,
                          })),
                        ),
                    )
                    .addChannelOption((option) =>
                      option
                        .setRequired(true)
                        .setName('thread')
                        .setDescription('Thread to add'),
                    ),
                ),
            ),
        ].map((c) => c.toJSON()),
      },
    )
}
