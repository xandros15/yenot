const {ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, ButtonStyle} = require(`discord.js`)

module.exports = {
  data: new SlashCommandBuilder()
    .setName('prompty')
    .setDescription('Wyświetla listę promptów'),
  async execute(interaction, {embeds, prisma}) {
    await interaction.deferReply({ephemeral: true})

    const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('add-prompty-button')
          .setLabel('Dodaj')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('remove-prompty-button')
          .setLabel('Usuń')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('edit-prompty-button')
          .setLabel('Edytuj')
          .setStyle(ButtonStyle.Primary)
      );
    const prompts = await prisma.Prompts.findMany()
    let description = ``
    for (const data of prompts) {
      description += `${data.id}. ${data.prompt}\n`
    }
    const records = await prisma.Prompts.aggregate({
      _count: {
        _all: true
      }
    })
    const embed = embeds.prompty(interaction, description, records._count._all)

    await interaction.editReply({embeds: [embed], components: [buttons]})
  }
}
