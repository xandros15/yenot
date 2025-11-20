const fs = require('fs');
const {REST, Routes} = require('discord.js');

const applicationCommands = {}
const commandDir = fs.readdirSync('./commands').filter(commandFile => commandFile.endsWith('.js'));

for (const commandFile of commandDir) {
  const commandName = `${commandFile}`.replace('.js', '');
  const command = require(`../commands/${commandFile}`);
  applicationCommands[commandName] = command.data.toJSON();
}

const contextMenusDir = fs.readdirSync('./contextMenus').filter(contextMenusFile => contextMenusFile.endsWith('.js'));

for (const contextMenuFile of contextMenusDir) {
  const contextMenuName = `${contextMenuFile}`.replace('.js', '');
  const contextMenu = require(`../contextMenus/${contextMenuFile}`);
  applicationCommands[contextMenuName] = contextMenu.data.toJSON();
}


module.exports = {
  execute(bot) {
    bot.on('ready', async () => {

      const rest = new REST({version: '10'}).setToken(process.env['DISCORD_TOKEN']);
      for (const guild of bot.guilds.cache) {
        await rest.put(Routes.applicationGuildCommands(bot.user.id, guild[0]), {body: Object.values(applicationCommands)});
      }

    })
  }
}
