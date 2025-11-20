const {} = require(`discord.js`)

module.exports = {
  async execute(interaction, {prisma}) {
    await interaction.deferReply({ephemeral: true})
    const text = interaction.fields.getTextInputValue('text')
    try {
      const record = await prisma.Prompts.create({
        data: {prompt: `${text}`}
      })
      await interaction.editReply(`Dodano prompt '${record.prompt}' otrzymał id [${record.id}]`)
      console.log(`${interaction.user.tag} dodał prompt '${record.prompt}' otrzymał id [${record.id}]`)
    } catch (error) {
      await interaction.editReply('Taki prompt już istnieje')
    }
  }
}
