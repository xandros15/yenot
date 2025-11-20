const {ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle} = require(`discord.js`)

module.exports = {
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('remove-prompty-modal')
      .setTitle('Usuwanie prompta')
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('number')
            .setLabel('Podaj numer prompta do usunięcia')
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setMaxLength(3)
            .setRequired(true)
        )
      )
    await interaction.showModal(modal)
  }
}
