module.exports = {
  execute(bot, {prisma, webhook}) {
    bot.on('guildScheduledEventUpdate', async (oldEvent, newEvent) => {
      const channel = await newEvent.guild.channels.fetch(`${newEvent.channelId}`);
      const members = await channel.members;
      const Time = Date.now();

      if (newEvent.isCompleted()) {
        console.log(`Zakończył się event: ${oldEvent.name} na kanale: ${channel.name} obecni na kanale:`)
        let list = '';
        for (const member of members) {
          console.log(`${member[1].user.tag} [${member[1].id}]`)
          list += `${member[1].user.tag} [${member[1]}]\n`
          const event = await prisma.EventData.findFirst({
            where: {id: `${member[1].id}`}
          })
          const minutes = Math.floor((Time - event.joined) / 60000);
          await prisma.UserData.upsert({
            where: {id: `${member[1].id}`},
            update: {
              id: `${member[1].id}`,
              voicecount: {increment: minutes}
            },
            create: {
              id: `${member[1].id}`,
              voicecount: minutes
            }
          })
        }
        await webhook.logi.send(`Zakończył się event: ${oldEvent.name} na kanale: ${channel} obecni na kanale:\n` + list)
      }
      if (!oldEvent.isActive() && newEvent.isActive()) {
        console.log(`Zaczął się event: ${newEvent.name} na kanale: ${channel.name} obecni na kanale:`)
        let list = '';
        for (const member of members) {
          console.log(`${member[1].user.tag} [${member[1].id}]`)
          list += `${member[1].user.tag} [${member[1]}]\n`
          await prisma.EventData.upsert({
            where: {id: `${member[1].id}`},
            update: {
              joined: `${Time}`
            },
            create: {
              id: `${member[1].id}`,
              joined: `${Time}`
            }
          })
        }
        await webhook.logi.send(`Zaczął się event: ${newEvent.name} na kanale: ${channel} obecni na kanale:\n` + list)
      }
    })
  }
}
