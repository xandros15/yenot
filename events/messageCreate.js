const {urlPreviewReplace, rules} = require("../functions/urlPreviewReplacer");
const PREFIX = "!"
const {env} = process;
const DAILY_MUSIC_CHAN = env['DAILY_MUSIC_CHAN'];
const CHANNELS_TIER_3 = env[`CHANNELS_TIER_3`].split(',').map(s => s.trim());
const CHANNELS_TIER_2 = env[`CHANNELS_TIER_2`].split(',').map(s => s.trim());
const CHANNELS_TIER_1 = env[`CHANNELS_TIER_1`].split(',').map(s => s.trim());

const ALL_LISTEN_CHANNELS = [
  ...CHANNELS_TIER_3,
  ...CHANNELS_TIER_2,
  ...CHANNELS_TIER_1,
]

function getValuable(chan) {
  if (CHANNELS_TIER_3.indexOf(chan) !== -1) {
    return 3
  }
  if (CHANNELS_TIER_2.indexOf(chan) !== -1) {
    return 2
  }
  if (CHANNELS_TIER_1.indexOf(chan) !== -1) {
    return 1
  }
  return 0;
}

module.exports = {
  execute(bot, {prisma, webhook}) {

    bot.on('messageCreate', async (message) => {
      if (message.author.bot) return;
      if (message.webhookId) return;
      if (message.content.startsWith(`${PREFIX}`) && (message.channel.id == DAILY_MUSIC_CHAN)) {
        const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        try {
          const command_file = require(`../fallback_commands/${command}.js`)
          await command_file.execute(message, {prisma, webhook}, args)
        } catch (error) {
          console.error(error)
        }
        return 0;
      }

      if (ALL_LISTEN_CHANNELS.indexOf(`${message.channel.id}`) !== -1) {
        const valuable = getValuable(`${message.channel.id}`)
        const month = (new Date()).getMonth()
        const year = (new Date()).getFullYear()
        await prisma.MonthMessages.upsert({
          where: {userId_month_year: {userId: `${message.author.id}`, month, year}},
          update: {
            userId: `${message.author.id}`,
            messages: {increment: valuable},
            month,
            year,
          },
          create: {
            userId: `${message.author.id}`,
            messages: valuable,
            month,
            year,
          }
        })
      }


      //////// POPRAWIANIE EMBEDÓW Z LINKÓW ////////
      const replacedLinks = urlPreviewReplace(message.content, rules)

      if (replacedLinks.length > 0) {
        await Promise.all([
          message.reply({
            content: replacedLinks.join("\n"),
            allowedMentions: {
              repliedUser: false
            },
          }),
          message.suppressEmbeds(true),
        ])
      }
    })
  }
}
