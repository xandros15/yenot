const {ActionRowBuilder, ButtonBuilder, SlashCommandBuilder} = require(`discord.js`)

module.exports = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('test'),
  async execute(interaction) {
    await interaction.deferReply({ephemeral: true})
    const button = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('test-button')
          .setLabel('test')
          .setStyle(1),
      );

    await interaction.editReply({content: `Test`, components: [button]})
  }
}
