const DAILY_MUSIC_CHALLENGE_ROLE = process.env[`DAILY_MUSIC_CHALLENGE_ROLE`];

module.exports = {
  execute(bot, {prisma}) {
    bot.on('guildMemberUpdate', async (oldMember, newMember) => {
      const member = await newMember.guild.members.fetch(`${newMember.id}`)

      if (member.roles.cache.has(DAILY_MUSIC_CHALLENGE_ROLE)) {
        await prisma.dailyActivity.upsert({
          where: {id: `${member.id}`},
          update: {},
          create: {
            id: `${member.id}`,
            reroll: true,
            count: 0,
            selected: false,
            completed: false,
            prompt: '',
          }
        })
      }

      if (!member.roles.cache.has(DAILY_MUSIC_CHALLENGE_ROLE)) {
        await prisma.dailyActivity.deleteMany({
          where: {
            id: `${member.id}`,
            selected: {equals: false}
          }
        })
      }
    })
  }
}
