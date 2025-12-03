const {submitChallenge} = require("../functions/dailyMusicChallenge");

module.exports = {
  async execute(message, {prisma, webhook}, args) {
    const link = args[0]
    const results = await submitChallenge(
      message.author.id.toString(),
      link,
      prisma,
    );

    if (!results.success) {
      return;
    }

    await webhook.daily.send(`Zadanie ${results.data.prompt} zostało wykonane! ${message.author} zapostował: ${results.data.link}`)
  }
}
