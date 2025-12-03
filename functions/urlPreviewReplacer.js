module.exports = {
  rules: [
    {//instagram reel
      regex: /https?:\/\/(?:www\.)?instagram\.com\/reel\/([\w@-]+)/g,
      replacement: 'https://www.kkinstagram.com/reel/$1',
    },
    {//instagram post
      regex: /https?:\/\/(?:www\.)?instagram\.com\/p\/([\w@-]+)/g,
      replacement: 'https://www.uuinstagram.com/p/$1',
    },
    {//tiktok video
      regex: /https?:\/\/(?:www\.)?tiktok\.com(\/@[a-zA-Z0-9_]+)\/video(\/[\w@/-]+)/g,
      replacement: 'https://d.tnktok.com$1/video$2',
    },
    {//tiktok post
      regex: /https?:\/\/vm\.tiktok\.com(\/[\w@/-]+)/g,
      replacement: 'https://d.tnktok.com$1',
    },
    {//twitter
      regex: /https?:\/\/(?:www\.)?(?:twitter|x)\.com(\/[a-zA-Z0-9_]+)\/status(\/[\w@/-]+)/g,
      replacement: 'https://vxtwitter.com$1/status$2',
    },
    {//pixiv
      regex: /https?:\/\/(?:www\.)?pixiv\.net(\/[\w/-]+)/g,
      replacement: 'https://phixiv.net$1',
    },
    {//reddit
      regex: /https?:\/\/(?:www\.)?(?:old\.)?reddit\.com(\/[\w@/-]+)/g,
      replacement: 'https://rxddit.com$1',
    },
    {//amiami eng
      regex: /https?:\/\/(?:www\.)?amiami\.com\/eng\/detail\/?\?gcode=([\w-]+)/g,
      replacement: 'https://figurki.harvestasha.org/eng/detail?gcode=$1',
    },
    {//amiami jp
      regex: /https?:\/\/(?:www\.)?amiami\.jp\/top\/detail\/detail\/?\?gcode=([\w-]+)/g,
      replacement: 'https://figurki.harvestasha.org/eng/detail?gcode=$1',
    },
  ],
  /**
   * @param content String
   * @param rules Array
   *
   * @return String[]
   */
  urlPreviewReplace(content, rules) {
    const links = []
    for (const rule of rules) {
      if (!rule.regex.test(content)) {
        continue;
      }
      for (const url of content.match(rule.regex)) {
        let replacedUrl = url.replace(rule.regex, rule.replacement)
        if (content.includes(`||${url}`)) {
          replacedUrl = `||${replacedUrl}||`
        } else if (content.includes(`<${url}`)) {
          replacedUrl = `<${replacedUrl}>`
        }

        links.push(replacedUrl)
      }
    }

    return links;
  }
}
