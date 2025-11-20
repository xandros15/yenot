const {} = require(`discord.js`)

module.exports = {
  async execute(interaction, {prisma}) {
    await interaction.deferReply({ephemeral: true})
    const text = interaction.fields.getTextInputValue('text')
    const number = interaction.fields.getTextInputValue('number')
    try {
      const record = await prisma.Prompts.update({
        where: {id: parseInt(number)},
        data: {
          prompt: `${text}`
        }
      })
      await interaction.editReply(`Zmieniono prompt [${record.id}] na '${record.prompt}'`)
      console.log(`${interaction.user.tag} zmienił prompt [${record.id}] na '${record.prompt}'`)
    } catch (error) {
      await interaction.editReply('Taki prompt już istnieje')
    }
  }
}
