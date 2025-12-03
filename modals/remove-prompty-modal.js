module.exports = {
  async execute(interaction, {prisma}) {
    await interaction.deferReply({ephemeral: true})
    const number = interaction.fields.getTextInputValue('number')
    try {
      const record = await prisma.Prompts.delete({
        where: {id: parseInt(number)}
      })
      await interaction.editReply(`Usunięto prompt: ${record.prompt}`)
      console.log(`${interaction.user.tag} usunął prompt: ${record.prompt}`)
    } catch {
      await interaction.editReply('Błędny ID prompta')
    }
  }
}
