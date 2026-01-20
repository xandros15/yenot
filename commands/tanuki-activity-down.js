const {SlashCommandBuilder} = require(`discord.js`);
const {env} = process;
const BIG_TANUKI_ROLE = env[`BIG_TANUKI_ROLE`];
const SERVER_ID = env[`SERVER_ID`];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tanuki-activity-down')
    .setDescription('Odbierz role aktywności'),
  async execute(interaction, {bot}) {
    const guild = await bot.guilds.fetch(SERVER_ID)
    guild
      .roles
      .cache
      .get(BIG_TANUKI_ROLE)
      .members
      .forEach(
        m => m
          .roles
          .remove(BIG_TANUKI_ROLE)
      );

    await interaction.reply({content: `Wykonano!`, ephemeral: true});
  }
}
