module.exports = {
  async execute(message, {prisma, webhook}) {
    const dailyUser = await prisma.dailyActivity.findFirst({
      where: {selected: true},
      orderBy: {count: 'asc'}
    })

    if ((dailyUser?.id == message.author.id) && dailyUser?.reroll) {
      const prompts = await prisma.Prompts.findMany({
        where: {prompt: {not: `${dailyUser.prompt}`}}
      })
      const givenPrompt = prompts[Math.floor(Math.random() * prompts.length)].prompt
      await webhook.daily.send(`${message.author} zrerolował '${dailyUser.prompt}' na '${givenPrompt}'`)
      console.log(`${message.author.tag} zrerolował '${dailyUser.prompt}' na '${givenPrompt}'`)
      await prisma.dailyActivity.update({
        where: {id: `${message.author.id}`},
        data: {
          reroll: false,
          prompt: givenPrompt
        }
      })
    }
  }
}
