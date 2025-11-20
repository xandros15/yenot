const {SlashCommandBuilder} = require(`discord.js`);
const {env} = process;
const OFFKAI_ROLE = env[`OFFKAI_ROLE`];
const ONKAI_ROLE = env[`ONKAI_ROLE`];
const ADMIN_ROLE = env[`ADMIN_ROLE`];


module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('ping na offkai bądź onkai')
    .addStringOption(option => option.setName('role')
      .setDescription('rola do pingowania')
      .addChoices({name: 'Offkai', value: OFFKAI_ROLE}, {name: 'Onkai', value: ONKAI_ROLE}, {
        name: 'Adminon',
        value: ADMIN_ROLE
      })
      .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply({ephemeral: true})
    const role_id = interaction.options.getString('role')
    const role = await interaction.guild.roles.fetch(role_id)
    await interaction.channel.send({content: `${role}`});
    await interaction.editReply({content: `Spingowano rolę ${role.name}!`})
  }
}
