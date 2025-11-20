const {SlashCommandBuilder} = require(`discord.js`)

module.exports = {
  data: new SlashCommandBuilder()
    .setName('staty')
    .setDescription('Sprawdź statystyki użytkownika')
    .addUserOption(option => option
      .setName('user')
      .setDescription('użytkownik do sprawdzenia')
      .setRequired(true)),
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
