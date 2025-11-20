const {SlashCommandBuilder} = require(`discord.js`);
const {env} = process;
const TANUKI_ROLE = env[`TANUKI_ROLE`];
const SERVER_ID = env[`SERVER_ID`];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tanuki-activity-up')
    .setDescription('Nadaj role najbardziej aktywnym'),
  async execute(interaction, {prisma, bot}) {
    const guild = await bot.guilds.fetch(SERVER_ID)
    const date = new Date()
    date.setDate(0) //timeshift to previous month (counting with year)
    const previousYear = date.getFullYear()
    const previousMonth = date.getMonth()
    const nthUserNumber = 20
    const offset = 5

    const lastTopUser = await prisma.MonthMessages.findFirst({
      where: {month: previousMonth, year: previousYear},
      skip: nthUserNumber,
      take: 1,
      orderBy: {
        messages: 'desc',
      },
    })
    if (lastTopUser === null) {
      await interaction.reply({content: `Nie znaleziono żadnych wiadomości w danym miesiącu!`, ephemeral: true});
      return;
    }

    const activeUsers = await prisma.MonthMessages.findMany({
      where: {messages: {gte: lastTopUser.messages}, month: previousMonth, year: previousYear},
      select: {
        userId: true,
      },
      take: nthUserNumber + offset,
    })

    for (const activeUser of activeUsers) {
      try {
        const member = await guild.members.fetch(activeUser.userId)
        member.roles.add(TANUKI_ROLE)
      } catch (e) {
        console.error(e)
      }
    }
    const content = `Wykonano dla miesiąca ${lastTopUser.month}. Ostatni z ${nthUserNumber} miał ${lastTopUser.messages} wiadomości i był to ${lastTopUser.userId}!`;

    await interaction.reply({content, ephemeral: true});
  }
}
