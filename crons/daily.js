const {env} = process;
const SERVER_ID = env['SERVER_ID'];
const DAILY_MUSIC_CHALLENGE_ROLE = env[`DAILY_MUSIC_CHALLENGE_ROLE`];

module.exports = {
  async challange(prisma, webhook, bot) {
    const prompts = await prisma.Prompts.findMany()
    const yesterdayUser = await prisma.dailyActivity.findMany({
      where: {selected: true},
      orderBy: {count: 'asc'},
      take: 1000
    })
    if (yesterdayUser[0] && !yesterdayUser[0].completed) {
      await webhook.daily.send(`Karny bakłażan dla <@${yesterdayUser[0].id}> :eggplant: :anger:`)
      await prisma.dailyActivity.delete({
        where: {id: `${yesterdayUser[0].id}`}
      })
      try {
        const guild = await bot.guilds.fetch(SERVER_ID);
        const user = await guild.members.fetch(yesterdayUser[0].id)
        await user.roles.remove(DAILY_MUSIC_CHALLENGE_ROLE)
      } catch (error) {
        console.log(error)
      }
    }
    const dailyUsers = await prisma.dailyActivity.findMany({
      where: {selected: false},
      take: 1000
    })
    await prisma.dailyActivity.updateMany({
      where: {reroll: false},
      data: {reroll: true}
    })
    await prisma.dailyActivity.updateMany({
      where: {selected: true},
      data: {selected: false}
    })
    await prisma.dailyActivity.updateMany({
      where: {completed: true},
      data: {completed: false}
    })
    let selectedUserId;
    let select = true;
    while (select) {
      selectedUserId = dailyUsers[Math.floor(Math.random() * dailyUsers.length)].id
      try {
        const guild = await bot.guilds.fetch(SERVER_ID)
        await guild.members.fetch(selectedUserId)
        select = false;
      } catch {
        await prisma.dailyActivity.delete({
          where: {id: `${selectedUserId}`}
        })
      }
    }
    const givenPrompt = prompts[Math.floor(Math.random() * prompts.length)].prompt
    await prisma.dailyActivity.upsert({
      where: {id: `${selectedUserId}`},
      update: {
        selected: true,
        prompt: givenPrompt
      },
      create: {
        id: `${selectedUserId}`,
        reroll: true,
        count: 0,
        selected: true,
        completed: false,
        prompt: givenPrompt,
      }
    })
    await webhook.daily.send(`Siema <@${selectedUserId}>, zapostuj dzisiaj ${givenPrompt} [jeśli chcesz zrerolować użyj komendy /reroll a jeśli chcesz oddać zadanie użyj komendy /submit]`)
    console.log(`Daily challenge dla : ${selectedUserId}, prompt: ${givenPrompt}`)
  },
  async remind(prisma, webhook) {
    const selectedUser = await prisma.dailyActivity.findFirst({
      where: {selected: true}
    })
    console.log(`reminder`)
    if (!selectedUser || selectedUser.completed) return;
    await webhook.daily.send(`Siema <@${selectedUser.id}> przypomnienie o challenge'u, zapostuj: ${selectedUser.prompt}`)
  }
}
