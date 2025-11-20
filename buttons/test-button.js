module.exports = {
  async execute(interaction) {
    await interaction.deferReply({ephemeral: true});
    await interaction.editReply(`OK`)
  }
}
