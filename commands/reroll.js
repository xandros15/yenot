const {SlashCommandBuilder} = require(`discord.js`)

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reroll')
    .setDescription('Losuje ci nowe zadanie na dzisiaj'),
  async execute(interaction, {prisma, webhook}) {
    await interaction.deferReply({ephemeral: true})
    const dailyUser = await prisma.dailyActivity.findFirst({
      where: {selected: true},
      orderBy: {count: 'asc'}
    })

    if (dailyUser?.id == interaction.user.id && dailyUser?.reroll) {
      const prompts = await prisma.Prompts.findMany({
        where: {prompt: {not: `${dailyUser.prompt}`}}
      })
      const givenPrompt = prompts[Math.floor(Math.random() * prompts.length)].prompt
      await webhook.daily.send(`${interaction.user} zrerolował '${dailyUser.prompt}' na '${givenPrompt}'`)
      console.log(`${interaction.user.tag} zrerolował '${dailyUser.prompt}' na '${givenPrompt}'`)
      await prisma.dailyActivity.update({
        where: {id: `${interaction.user.id}`},
        data: {
          reroll: false,
          prompt: givenPrompt
        }
      })
      await interaction.editReply({content: `Zrerollowałeś '${dailyUser.prompt}' na '${givenPrompt}'`})
    } else {
      await interaction.editReply({content: `Dzisiaj nie dostałeś zadania albo już wykorzystałeś rerolla na dziś`})
    }
  }
}
