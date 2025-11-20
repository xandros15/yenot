module.exports = {
  async execute(message, {prisma, webhook}, args) {
    const regex = /(?:http:|https:)*?\/\/(?:www\.|)(?:youtube\.com|m\.youtube\.com|youtu\.|youtube-nocookie\.com).*(?:v=|v%3D|v\/|(?:a|p)\/(?:a|u)\/\d.*\/|watch\?|vi(?:=|\/)|\/embed\/|oembed\?|be\/|e\/)([^&?%#\/\n]*)/gm
    const link = args[0]
    const dailyUser = await prisma.dailyActivity.findMany({
      where: {selected: true},
      orderBy: {count: 'asc'},
      take: 1000
    })
    if (!link.match(regex)) {
      return 1;
    }
    if ((dailyUser[0]?.id == message.author.id) && !dailyUser[0]?.completed) {

      await webhook.daily.send(`${message.author} wysłał zadanie '${dailyUser[0].prompt}': ${link}`)
      console.log(`${message.author.tag} wysłał '${dailyUser[0].prompt}': '${link}'`)

      await prisma.dailyActivity.update({
        where: {id: `${message.author.id}`},
        data: {
          completed: true,
          count: {increment: 1}
        }
      })
    }
  }
}
