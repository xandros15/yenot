const {
  ApplicationCommandType,
  ContextMenuCommandBuilder
} = require(`discord.js`);

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('staty-user')
    .setType(ApplicationCommandType.User),
  async execute(interaction, {prisma, embeds}) {
    await interaction.deferReply({ephemeral: true})
    const user = interaction.options.getUser('user')
    const response = await prisma.UserData.findFirst({
      where: {id: `${user.id}`}
    })
    if (response) {
      const embed = embeds.commands_staty(interaction, user, response);
      await interaction.editReply({embeds: [embed]})
    } else {
      await interaction.editReply(`Użytkownika ${user} nie ma w bazie`)
    }
  }
}
