const {SlashCommandBuilder} = require(`discord.js`)

module.exports = {
  data: new SlashCommandBuilder()
    .setName('undo')
    .setDescription('Cofa zaliczenie obecnego zadania')
    .addBooleanOption(option => option.setName('chance').setDescription('Czy dać kolejną szansę?').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('powód').setRequired(true)),
  async execute(interaction, {prisma, webhook}) {
    await interaction.deferReply({ephemeral: true})
    const chance = interaction.options.getBoolean('chance')
    const reason = interaction.options.getString('reason')

    const dailyUser = await prisma.dailyActivity.findMany({
      where: {selected: true},
      orderBy: {count: 'asc'},
      take: 1000
    })

    if (!dailyUser[0]?.completed) {
      await interaction.editReply({content: `Dzisiejsze zadanie nie zostało jeszcze wykonane!`})
      return 0;
    }

    if (chance) {
      await prisma.dailyActivity.update({
        where: {id: dailyUser[0]?.id},
        data: {
          count: {decrement: 1},
          completed: false
        }
      })
      await webhook.daily.send(`${interaction.user} cofnął zaliczenie dzisiejszego zadania użytkownika <@${dailyUser[0]?.id}> z powodu: ${reason}, ale dał mu kolejną szansę`)
      console.log(`${interaction.user.tag} Cofnął zaliczenie i dał kolejną szansę, powód: ${reason}`)
      await interaction.editReply({content: `Cofnięto zaliczenie zadania i dano kolejną szansę!`})
    } else {
      await prisma.dailyActivity.update({
        where: {id: dailyUser[0]?.id},
        data: {count: {decrement: 1}}
      })
      await webhook.daily.send(`${interaction.user} cofnął zaliczenie dzisiejszego zadania użytkownika <@${dailyUser[0]?.id}> z powodu: ${reason}`)
      console.log(`${interaction.user.tag} Cofnął zaliczenie, powód: ${reason}`)
      await interaction.editReply({content: `Cofnięto zaliczenie zadania!`})
    }
  }
}
