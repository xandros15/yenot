const {EmbedBuilder} = require('discord.js');

module.exports = {
  commands_staty(interaction, user, response) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `Statystyki ${user?.tag}`,
        iconURL: `${interaction?.guild?.iconURL()}`
      })
      .setColor('#66A103')
      .addFields(
        {name: "Łącznie wiadomości (od odpalenia bota):", value: `${response.totalMessages}`},
        {name: "Ilość minut na panelach:", value: `${response.voicecount}`},
        {name: "Ilość pełnych godzin na panelach:", value: `${Math.floor(response.voicecount / 60)}`}
      )
      .setThumbnail(user.displayAvatarURL())

    if (response.lastMessageTimestamp != 'null') {
      embed.setFooter({text: 'Ostatnio napisana wiadomość: '}).setTimestamp(parseInt(response.lastMessageTimestamp));
    }

    return embed;
  },
  prompty(interaction, description, number) {
    return (
      new EmbedBuilder()
        .setAuthor({
          name: `Dostępne prompty`,
          iconURL: `${interaction?.guild?.iconURL()}`
        })
        .setColor(`#E69B00`)
        .setDescription(description)
        .setFooter({text: `Liczba promptów: ${number} | Total characters count: ${description.length}`})
    )
  }
}
