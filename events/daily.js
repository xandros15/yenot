const {challange, remind} = require(`../crons/daily`)
const cron = require('node-cron');
const DEFAULT_TIMEZONE = {
  scheduled: true,
  timezone: "Europe/Warsaw"
};

module.exports = {
  execute(bot, {prisma, webhook}) {

    bot.on('ready', async () => {

      // Cron codziennie o 7
      const task = cron.schedule('0 7 * * *', () => {
        challange(prisma, webhook, bot)
      }, DEFAULT_TIMEZONE)
      task.start()

      // Cron codziennie o 20
      const reminder = cron.schedule('0 20 * * *', () => {
        remind(prisma, webhook)
      }, DEFAULT_TIMEZONE)
      reminder.start()

      // Cron codziennie o 15
      // @todo implement this feature
      // const scheduleEventsModsReminder = cron.schedule(
      //     '0 15 * * *',
      //     () => scheduleEventsModsRemind(webhook, bot),
      //     DEFAULT_TIMEZONE
      // )
      // scheduleEventsModsReminder.start()
    })
  }
}
