const LISTENER_ROLE = process.env['LISTENER_ROLE']

module.exports = {
  execute(bot, {prisma, webhook}) {
    bot.on('voiceStateUpdate', async (oldState, newState) => {
      if (oldState.channelId === newState.channelId) {
        return;
      }

      const scheduledEvents = await oldState.guild.scheduledEvents.fetch();
      let eventChannels = []
      for (const scheduledEvent of scheduledEvents) {
        if (scheduledEvent[1].isActive()) {
          eventChannels.push(scheduledEvent[1].channelId)
        }
      }

      if (eventChannels.length === 0) {
        return;
      }

      const Time = Date.now();
      if (eventChannels.includes(oldState.channelId) && eventChannels.includes(newState.channelId)) {
        console.log(`${oldState.member.user.tag} [${oldState.member.id}] przełączył się z: ${oldState.channel.name} na: ${newState.channel.name}`)
        await webhook.logi.send(`${oldState.member.user.tag} [${oldState.member}] przełączył się z: ${oldState.channel} na: ${newState.channel}`)
        return;
      }

      if (eventChannels.includes(oldState.channelId)) {
        console.log(`${oldState.member.user.tag} [${oldState.member.id}] rozłączył się z: ${oldState.channel.name}`)
        await webhook.logi.send(`${oldState.member.user.tag} [${oldState.member}] rozłączył się z: ${oldState.channel}`)
        const event = await prisma.EventData.findFirst({
          where: {id: `${newState.member.id}`}
        })
        const minutes = Math.floor((Time - event.joined) / 60000);
        const user = await prisma.UserData.upsert({
          where: {id: `${newState.member.id}`},
          update: {
            id: `${newState.member.id}`,
            voicecount: {increment: minutes}
          },
          create: {
            id: `${newState.member.id}`,
            voicecount: minutes
          }
        })
        if (Math.floor(user.voicecount / 60) >= 5) {
          await newState.member.roles.add(LISTENER_ROLE)
        }
      }

      if (eventChannels.includes(newState.channelId)) {
        console.log(`${newState.member.user.tag} [${newState.member.id}] dołączył na: ${newState.channel.name}`)
        await webhook.logi.send(`${newState.member.user.tag} [${newState.member}] dołączył na: ${newState.channel}`)
        await prisma.EventData.upsert({
          where: {id: `${newState.member.id}`},
          update: {
            joined: `${Time}`
          },
          create: {
            id: `${newState.member.id}`,
            joined: `${Time}`
          }
        })
      }
    })
  }
}
