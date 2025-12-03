const {SlashCommandBuilder} = require(`discord.js`)
const {submitChallenge} = require("../functions/dailyMusicChallenge");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('submit')
    .setDescription('Zgłoś zadanie na dzisiaj')
    .addStringOption(option => option.setName('link').setDescription('link').setRequired(true)),
  async execute(interaction, {prisma, webhook}) {
    await interaction.deferReply({ephemeral: true})

    const results = await submitChallenge(
      interaction.user.id.toString(),
      interaction.options.getString('link'),
      prisma,
    );

    if (!results.success) {
      interaction.editReply({content: results.message})

      return;
    }

    interaction.editReply({content: `Dzięki za wykonanie zadania!`})
    await webhook.daily.send(`Zadanie ${results.data.prompt} zostało wykonane! ${interaction.user} zapostował: ${results.data.link}`)
  }
}
