const {urlPreviewReplace, rules} = require("./urlPreviewReplacer");

test('Url preview replace when content has correct link then return replaced link in array', () => {
  const rules = [
    {
      regex: /https?:\/\/(?:www\.)?instagram\.com\/reel\/([\w@-]+)/g,
      replacement: 'https://www.ddinstagram.com/reel/$1',
    }
  ]
  const expectedLinkList = urlPreviewReplace('Hey, this is awesome link: https://www.instagram.com/reel/DQt_oTQjBKj/', rules);

  expect(expectedLinkList).toContain('https://www.ddinstagram.com/reel/DQt_oTQjBKj')
})

test('Url preview replace when content has correct link in spoiler then return replaced link in spoiler in array', () => {
  const rules = [
    {
      regex: /https?:\/\/(?:www\.)?instagram\.com\/reel\/([\w@-]+)/g,
      replacement: 'https://www.ddinstagram.com/reel/$1',
    }
  ]
  const expectedLinkList = urlPreviewReplace('Hey, this is awesome link: ||https://www.instagram.com/reel/DQt_oTQjBKj/||', rules);

  expect(expectedLinkList).toContain('||https://www.ddinstagram.com/reel/DQt_oTQjBKj||')
})

test('Url preview replace when content has correct escaped link then return replaced escaped link in array', () => {
  const rules = [
    {
      regex: /https?:\/\/(?:www\.)?instagram\.com\/reel\/([\w@-]+)/g,
      replacement: 'https://www.ddinstagram.com/reel/$1',
    }
  ]
  const expectedLinkList = urlPreviewReplace('Hey, this is awesome link: <https://www.instagram.com/reel/DQt_oTQjBKj/>', rules);

  expect(expectedLinkList).toContain('<https://www.ddinstagram.com/reel/DQt_oTQjBKj>')
})


test('Url preview replace when content has no link then return empty array', () => {
  const rules = [
    {
      regex: /https?:\/\/(?:www\.)?instagram\.com\/reel\/([\w@-]+)/g,
      replacement: 'https://www.ddinstagram.com/reel/$1',
    }
  ]
  const expectedLinkList = urlPreviewReplace('Hey, this is awesome', rules);

  expect(expectedLinkList).toEqual([])
})

test('Url preview replace when content has unsupported link then return empty array', () => {
  const rules = [
    {
      regex: /https?:\/\/(?:www\.)?instagram\.com\/reel\/([\w@-]+)/g,
      replacement: 'https://www.ddinstagram.com/reel/$1',
    }
  ]
  const expectedLinkList = urlPreviewReplace('Hey, this is awesome: https://www.uuinstagram.com/p/DRaqAW0jazi/', rules);

  expect(expectedLinkList).toEqual([])
})

test('Url preview replace when content has multiple link then return replaced multiple link in list', () => {
  const rules = [
    {
      regex: /https?:\/\/(?:www\.)?instagram\.com\/reel\/([\w@-]+)/g,
      replacement: 'https://www.ddinstagram.com/reel/$1',
    }
  ]
  const expectedLinkList = urlPreviewReplace('Hey, this is awesome: https://www.instagram.com/reel/DRaqAW0jazi/ https://www.instagram.com/reel/DRaqAW0jazb', rules);

  expect(expectedLinkList).toEqual([
    'https://www.ddinstagram.com/reel/DRaqAW0jazi',
    'https://www.ddinstagram.com/reel/DRaqAW0jazb',
  ])
})

test('Url preview replace when content has multiple link and one in spoiler then return replaced multiple link with one in spoiler in list', () => {
  const rules = [
    {
      regex: /https?:\/\/(?:www\.)?instagram\.com\/reel\/([\w@-]+)/g,
      replacement: 'https://www.ddinstagram.com/reel/$1',
    }
  ]
  const expectedLinkList = urlPreviewReplace('Hey, this is awesome: ||https://www.instagram.com/reel/DRaqAW0jazi/|| https://www.instagram.com/reel/DRaqAW0jazb', rules);

  expect(expectedLinkList).toEqual([
    '||https://www.ddinstagram.com/reel/DRaqAW0jazi||',
    'https://www.ddinstagram.com/reel/DRaqAW0jazb',
  ])
})

test('Url preview replace when content has multiple link with one escaped then return replaced multiple link and one escaped in list', () => {
  const rules = [
    {
      regex: /https?:\/\/(?:www\.)?instagram\.com\/reel\/([\w@-]+)/g,
      replacement: 'https://www.ddinstagram.com/reel/$1',
    }
  ]
  const expectedLinkList = urlPreviewReplace('Hey, this is awesome: <https://www.instagram.com/reel/DRaqAW0jazi/> https://www.instagram.com/reel/DRaqAW0jazb', rules);

  expect(expectedLinkList).toEqual([
    '<https://www.ddinstagram.com/reel/DRaqAW0jazi>',
    'https://www.ddinstagram.com/reel/DRaqAW0jazb',
  ])
})


test('Url preview replace when content has instagram reel link then return replaced instagram reel link in list', () => {
  const expectedLinkList = urlPreviewReplace('Hey, this is awesome: https://www.instagram.com/reel/DRaqAW0jazi/', rules);

  expect(expectedLinkList).toEqual([
    'https://www.kkinstagram.com/reel/DRaqAW0jazi'
  ])
})
test('Url preview replace when content has instagram post link then return replaced instagram post link in list', () => {
  const expectedLinkList = urlPreviewReplace('Hey, this is awesome: https://www.instagram.com/p/DRaqAW0jazi/', rules);

  expect(expectedLinkList).toEqual([
    'https://www.uuinstagram.com/p/DRaqAW0jazi'
  ])
})

test('Url preview replace when content has amiami jp post link then return replaced amiami jp link in list', () => {
  const expectedLinkList = urlPreviewReplace('Hey, this is awesome: https://www.amiami.jp/top/detail/detail?gcode=FIGURE-041696-R', rules);

  expect(expectedLinkList).toEqual([
    'https://figurki.harvestasha.org/eng/detail?gcode=FIGURE-041696-R'
  ])
})

test('Url preview replace when content has amiami eng post link then return replaced amiami eng link in list', () => {
  const expectedLinkList = urlPreviewReplace('Hey, this is awesome: https://www.amiami.com/eng/detail?gcode=FIGURE-194870', rules);

  expect(expectedLinkList).toEqual([
    'https://figurki.harvestasha.org/eng/detail?gcode=FIGURE-194870'
  ])
})

test('Url preview replace when content has pixiv link then return replaced pixiv link in list', () => {
  const expectedLinkList = urlPreviewReplace('Hey, this is awesome: https://www.pixiv.net/en/artworks/137735988', rules);

  expect(expectedLinkList).toEqual([
    'https://phixiv.net/en/artworks/137735988'
  ])
})

test('Url preview replace when content has twitter link then return replaced twitter link in list', () => {
  const expectedLinkList = urlPreviewReplace('Hey, this is awesome: https://x.com/jiro_kame/status/1993213408133759160', rules);

  expect(expectedLinkList).toEqual([
    'https://vxtwitter.com/jiro_kame/status/1993213408133759160'
  ])
})

test('Url preview replace when content has reddit link then return replaced reddit link in list', () => {
  const expectedLinkList = urlPreviewReplace('Hey, this is awesome: https://www.reddit.com/r/interestingasfuck/comments/1p6av9n/mud_men_tribe_of_papua_new_guinea/', rules);

  expect(expectedLinkList).toEqual([
    'https://rxddit.com/r/interestingasfuck/comments/1p6av9n/mud_men_tribe_of_papua_new_guinea/'
  ])
})

test('Url preview replace when content has old reddit link then return replaced old reddit link in list', () => {
  const expectedLinkList = urlPreviewReplace('Hey, this is awesome: https://old.reddit.com/r/interestingasfuck/comments/1p6av9n/mud_men_tribe_of_papua_new_guinea/', rules);

  expect(expectedLinkList).toEqual([
    'https://rxddit.com/r/interestingasfuck/comments/1p6av9n/mud_men_tribe_of_papua_new_guinea/'
  ])
})

test('Url preview replace when content has vm tiktok link then return replaced vm tiktok link in list', () => {
  const expectedLinkList = urlPreviewReplace('Hey, this is awesome: https://vm.tiktok.com/ZNdTaBLxS/', rules);

  expect(expectedLinkList).toEqual([
    'https://d.tnktok.com/ZNdTaBLxS/'
  ])
})

test('Url preview replace when content has tiktok link then return replaced tiktok link in list', () => {
  const expectedLinkList = urlPreviewReplace('Hey, this is awesome: https://www.tiktok.com/@kyuko101/video/7560815908948626710', rules);

  expect(expectedLinkList).toEqual([
    'https://d.tnktok.com/@kyuko101/video/7560815908948626710'
  ])
})
