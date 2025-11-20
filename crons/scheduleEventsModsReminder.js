const {env} = process;
const MODE_ROLE = env['MODE_ROLE'];
const SERVER_ID = env['SERVER_ID'];

function lessThanDay(dateTime) {
  const time = dateTime.valueOf() - (new Date()).valueOf()

  return time < 48 * 360000
}

function lessThan2Days(dateTime) {
  const time = dateTime.valueOf() - (new Date()).valueOf()

  return time > 72 * 360000
}

module.exports = {
  async scheduleEventsModsRemind({modsEventReminder}, bot) {
    if (modsEventReminder === null) {
      return
    }
    const guild = await bot.guilds.fetch(SERVER_ID);
    const scheduledEvents = await guild.scheduledEvents.fetch()
    for (const scheduledEvent of scheduledEvents) {
      if (
        lessThan2Days(scheduledEvent.scheduledStartAt)
        || lessThanDay(scheduledEvent.scheduledStartAt)
      ) {
        await modsEventReminder.send(`<@${MODE_ROLE}>: przypomnienie o zapostowaniu przypomnienia o wydarzeniu ${scheduledEvent.url}`)
      }
    }
  }
}
