require('dotenv').config()
const {PrismaClient} = require(`@prisma/client`)
const prisma = new PrismaClient()
prisma.$connect()
prisma.$disconnect()
const {Client, WebhookClient, GatewayIntentBits, ActivityType} = require('discord.js');
const fs = require('fs');
const bot = new Client({
  presence: {
    status: 'online',
    afk: false,
    activities: [{
      name: "Heisei Tanuki Gassen Ponpoko",
      type: ActivityType.Watching,
    }],
  },
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildScheduledEvents
  ]
});

const modsEventReminder = process.env[`WEBHOOK_MODERATOR_EVENT_REMINDER`] ? new WebhookClient({url: `${process.env[`WEBHOOK_MODERATOR_EVENT_REMINDER`]}`}) : null;
const webhooks = {
  logi: new WebhookClient({url: `${process.env[`WEBHOOK_LOGI`]}`}),
  daily: new WebhookClient({url: `${process.env[`WEBHOOK_DAILY`]}`}),
  modsEventReminder,
}

let embeds = {}
const embedDir = fs.readdirSync('./embeds').filter(embedFile => embedFile.endsWith('.js'));

for (const embedFile of embedDir) {
  const embed = require(`./embeds/${embedFile}`);
  embeds = Object.assign(embeds, embed);
}

const options = {
  webhook: webhooks,
  prisma: prisma,
  embeds: embeds,
  bot: bot,
}

const eventDir = fs.readdirSync('./events').filter(eventFile => eventFile.endsWith('.js'));

for (const eventFile of eventDir) {
  const event = require(`./events/${eventFile}`);
  event.execute(bot, options);
}

bot.on('interactionCreate', async interaction => {

  let type = 'commands'
  switch (true) {
    case interaction.isAnySelectMenu():
      type = 'selectMenus'
      break;
    case interaction.isModalSubmit():
      type = 'modals'
      break;
    case interaction.isContextMenuCommand():
      type = 'contextMenus'
      break;
    case interaction.isButton():
      type = 'buttons'
      break;
  }

  interaction.commandName ? commandType = interaction.commandName : commandType = interaction.customId

  const command = require(`./${type}/${commandType}`);
  command.execute(interaction, options);
})

bot.login(process.env[`DISCORD_TOKEN`]);

