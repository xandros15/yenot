module.exports = {
  execute(bot) {
    bot.on('ready', async () => {
      // Fetchowanie kanałów i memberów
      const guilds = await bot.guilds.fetch()
      for (const guild of guilds) {
        const thisGuild = await bot.guilds.fetch(`${guild[1].id}`)
        await thisGuild.members.fetch();
        await thisGuild.channels.fetch();
        console.log(thisGuild.name, thisGuild.id, thisGuild.memberCount)
      }
      console.log(bot.user.username, bot.user.id)
    })
  }
}
