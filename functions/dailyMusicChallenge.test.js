const {isValidLink, cleanUpLinkFromTracking} = require("./dailyMusicChallenge");

test('isValidLink when pass valid youtube link then return true', () => {
  const isValid = isValidLink('https://www.youtube.com/watch?v=jmKRgqWGrWc');

  expect(isValid).toBe(true)
})

test('isValidLink when pass valid youtu.be link then return true', () => {
  const isValid = isValidLink('https://www.youtu.be/jmKRgqWGrWc');

  expect(isValid).toBe(true)
})

test('isValidLink when pass valid youtube-nocookie.com link then return true', () => {
  const isValid = isValidLink('https://www.youtube-nocookie.com/embed/jmKRgqWGrWc');

  expect(isValid).toBe(true)
})

test('isValidLink when pass valid animethemes.moe link then return true', () => {
  const isValid = isValidLink('https://animethemes.moe/anime/evangelion_10_you_are_not_alone/ED1-BD1080');

  expect(isValid).toBe(true)
})

test('isValidLink when pass valid m.youtube.com link then return true', () => {
  const isValid = isValidLink('https://m.youtube.com/watch?v=jmKRgqWGrWc');

  expect(isValid).toBe(true)
})


test('isValidLink when pass string that isnt link then return false', () => {
  const isValid = isValidLink('this isnt link');

  expect(isValid).toBe(false)
})


test('isValidLink when pass not supported domain link then return false', () => {
  const isValid = isValidLink('https://open.spotify.com/track/4oE7MyJhqSD3BaHRpNs8Nl');

  expect(isValid).toBe(false)
})

test('cleanUpLinkFromTracking when pass link with whitelisted param then return cleaned link', () => {
  const link = cleanUpLinkFromTracking('https://www.youtube.com/watch?v=jmKRgqWGrWc');

  expect(link).toBe('https://www.youtube.com/watch?v=jmKRgqWGrWc')
})

test('cleanUpLinkFromTracking when pass link with multiple params then return cleaned link', () => {
  const link = cleanUpLinkFromTracking('https://www.youtube.com/watch?v=jmKRgqWGrWc&si=2j13jdas9ytbbb93i');

  expect(link).toBe('https://www.youtube.com/watch?v=jmKRgqWGrWc')
})

test('cleanUpLinkFromTracking when pass link without any params then return cleaned link', () => {
  const link = cleanUpLinkFromTracking('https://www.youtu.be/jmKRgqWGrWc');

  expect(link).toBe('https://www.youtu.be/jmKRgqWGrWc')
})
