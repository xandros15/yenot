const {SlashCommandBuilder} = require(`discord.js`)

module.exports = {
  data: new SlashCommandBuilder()
    .setName('force')
    .setDescription('Wymusza nowe losowanie daily [awaryjne]'),
  async execute(interaction, {prisma, webhook}) {
    await interaction.deferReply({ephemeral: true})

    const prompts = await prisma.Prompts.findMany()
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
    const selectedUserId = dailyUsers[Math.floor(Math.random() * dailyUsers.length)].id
    const givenPrompt = prompts[Math.floor(Math.random() * prompts.length)]
    await prisma.dailyActivity.upsert({
      where: {id: `${selectedUserId}`},
      update: {
        selected: true,
        prompt: givenPrompt.prompt
      },
      create: {
        id: `${selectedUserId}`,
        reroll: true,
        count: 0,
        selected: true,
        completed: false,
        prompt: givenPrompt.prompt,
      }
    })
    await webhook.daily.send(`Siema <@${selectedUserId}>, zapostuj dzisiaj ${givenPrompt.prompt} [jeśli chcesz zrerolować użyj komendy /reroll a jeśli chcesz oddać zadanie użyj komendy /submit]`)
    console.log(`Daily challenge dla : ${selectedUserId}, prompt: ${givenPrompt.prompt} [forced]`)

    await interaction.editReply({content: `Wymuszono losowanie daily!`})
  }
}
