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
      let replaced_links = "";
      let spoiler_links = false;
      const spoiler_regex = /\|\|(.*?)\|\|/g;
      if (spoiler_regex.test(message.content)) spoiler_links = true;
      const tiktok_regex = /https?:\/\/(?:www\.)?tiktok\.com(\/\@[a-zA-Z0-9_]+)\/video(\/[\w@/-]+)?/g;
      if (tiktok_regex.test(message.content)) {
        let tiktok_urls = message.content.match(tiktok_regex);
        for (const tiktok_url of tiktok_urls) {
          if (spoiler_links) {
            replaced_links += `||${tiktok_url.replace(tiktok_regex, "https://vxtiktok.com$1/video$2")}||\n`;
          } else {
            replaced_links += `${tiktok_url.replace(tiktok_regex, "https://vxtiktok.com$1/video$2")}\n`;
          }
        }
      }
      const tiktok_vm_regex = /https?:\/\/vm\.tiktok\.com(\/[\w@/-]+)?/g;
      if (tiktok_vm_regex.test(message.content)) {
        let tiktok_vm_urls = message.content.match(tiktok_vm_regex);
        for (const tiktok_vm_url of tiktok_vm_urls) {
          if (spoiler_links) {
            replaced_links += `||${tiktok_vm_url.replace(tiktok_vm_regex, "https://vm.vxtiktok.com$1")}||\n`;
          } else {
            replaced_links += `${tiktok_vm_url.replace(tiktok_vm_regex, "https://vm.vxtiktok.com$1")}\n`;
          }
        }
      }
      const twitter_regex = /https?:\/\/(?:www\.)?twitter\.com(\/[a-zA-Z0-9_]+)\/status(\/[\w@/-]+)?|www\.twitter\.com(\/[a-zA-Z0-9_]+)\/status(\/[\w@/-]+)?/g;
      if (twitter_regex.test(message.content)) {
        let twitter_urls = message.content.match(twitter_regex);
        for (const twitter_url of twitter_urls) {
          if (spoiler_links) {
            replaced_links += `||${twitter_url.replace(twitter_regex, "https://vxtwitter.com$1/status$2")}||\n`;
          } else {
            replaced_links += `${twitter_url.replace(twitter_regex, "https://vxtwitter.com$1/status$2")}\n`;
          }
        }
      }
      const x_regex = /https?:\/\/(?:www\.)?x\.com(\/[a-zA-Z0-9_]+)\/status(\/[\w@/-]+)?|www\.x\.com(\/[a-zA-Z0-9_]+)\/status(\/[\w@/-]+)?/g;
      if (x_regex.test(message.content)) {
        let x_urls = message.content.match(x_regex);
        for (const x_url of x_urls) {
          if (spoiler_links) {
            replaced_links += `||${x_url.replace(x_regex, "https://vxtwitter.com$1/status$2")}||\n`;
          } else {
            replaced_links += `${x_url.replace(x_regex, "https://vxtwitter.com$1/status$2")}\n`;
          }
        }
      }
      const pixiv_regex = /https?:\/\/(?:www\.)?pixiv\.net(\/[\w/-]+)?|www\.pixiv\.net(\/[\w/-]+)/g;
      if (pixiv_regex.test(message.content)) {
        let pixiv_urls = message.content.match(pixiv_regex);
        for (const pixiv_url of pixiv_urls) {
          if (spoiler_links) {
            replaced_links += `||${pixiv_url.replace(pixiv_regex, "https://phixiv.net$1")}||\n`;
          } else {
            replaced_links += `${pixiv_url.replace(pixiv_regex, "https://phixiv.net$1")}\n`;
          }
        }
      }
      const reddit_regex = /https?:\/\/(?:www\.)?(?:old\.)?reddit\.com(\/[\w@/-]+)?|www\.reddit\.com(\/[\w@/-]+)?/g;
      if (reddit_regex.test(message.content)) {
        let reddit_urls = message.content.match(reddit_regex);
        for (const reddit_url of reddit_urls) {
          if (spoiler_links) {
            replaced_links += `||${reddit_url.replace(reddit_regex, "https://rxddit.com$1")}||\n`;
          } else {
            replaced_links += `${reddit_url.replace(reddit_regex, "https://rxddit.com$1")}\n`;
          }
        }
      }

      if (replaced_links.length > 0) {
        await message.reply(replaced_links);
        await message.suppressEmbeds(true);
      }
    })

  }
}
