const {ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle} = require(`discord.js`)


module.exports = {
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('add-prompty-modal')
      .setTitle('Dodawanie prompta')
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('text')
            .setLabel('Podaj prompta')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder(`Zapostuj dzisiaj: `)
            .setRequired(true)
        )
      )
    await interaction.showModal(modal)
  }
}
