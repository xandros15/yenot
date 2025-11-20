const {SlashCommandBuilder} = require(`discord.js`)

module.exports = {
  data: new SlashCommandBuilder()
    .setName('submit')
    .setDescription('Zgłoś zadanie na dzisiaj')
    .addStringOption(option => option.setName('link').setDescription('link').setRequired(true)),
  async execute(interaction, {prisma, webhook}) {
    await interaction.deferReply({ephemeral: true})
    const regex = /(?:http:|https:)*?\/\/(?:www\.|)(?:youtube\.com|m\.youtube\.com|youtu\.|youtube-nocookie\.com).*(?:v=|v%3D|v\/|(?:a|p)\/(?:a|u)\/\d.*\/|watch\?|vi(?:=|\/)|\/embed\/|oembed\?|be\/|e\/)([^&?%#\/\n]*)/gm
    const link = interaction.options.getString('link')
    const dailyUser = await prisma.dailyActivity.findMany({
      where: {selected: true},
      orderBy: {count: 'asc'},
      take: 1000
    })
    if (!link.match(regex)) {
      await interaction.editReply({content: `Musi to być link do youtube!`})
      return 1;
    }
    if (dailyUser[0]?.id == interaction.user.id && !dailyUser[0]?.completed) {
      await interaction.editReply({content: `Wysłałeś zadanie!`})
      await webhook.daily.send(`${interaction.user} wysłał zadanie '${dailyUser[0].prompt}': ${link}`)
      console.log(`${interaction.user.tag} wysłał '${dailyUser[0].prompt}': '${link}'`)

      await prisma.dailyActivity.update({
        where: {id: `${interaction.user.id}`},
        data: {
          completed: true,
          count: {increment: 1}
        }
      })
    } else {
      await interaction.editReply({content: `Dzisiaj nie dostałeś zadania lub już je wysłałeś`})
    }
  }
}
