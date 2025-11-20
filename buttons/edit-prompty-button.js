const {ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle} = require(`discord.js`)

module.exports = {
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('edit-prompty-modal')
      .setTitle('Edytowanie prompta')
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('number')
            .setLabel('Podaj numer prompta do zmiany')
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setMaxLength(3)
            .setRequired(true),
        ),
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
