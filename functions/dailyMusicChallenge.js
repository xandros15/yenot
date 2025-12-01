const ALLOWED_URLS = [
  ['youtube.com', /\/watch/, 'v'],
  ['m.youtube.com', /\/watch/, 'v'],
  ['youtu.be', /\/\w+/],
  ['youtube-nocookie.com', /\/embed\/\w+/,],
  ['animethemes.moe', /\/anime\/.+/,],
]
const ALLOWED_QUERY_KEYS = ['v'];

/**
 * @param {string} link
 * @return {string}
 */
function cleanUpLinkFromTracking(link) {
  const url = URL.parse(link);
  const query = new URLSearchParams();
  for (const param of ALLOWED_QUERY_KEYS) {
    if (url.searchParams.has(param)) {
      query.set(param, url.searchParams.get(param))
    }
  }

  return link.replace(url.searchParams.toString(), query.toString())
}

/**
 * @param {string} link
 * @return {boolean}
 */
function isValidLink(link) {
  const url = URL.parse(link);
  if (url === null) {
    return false
  }

  for (const allowedUrl of ALLOWED_URLS) {
    if (allowedUrl[0] !== url.host.replace(/^www\./, '')) {
      continue;
    }

    if (!url.pathname.match(allowedUrl[1])) {
      return false;
    }

    if (!allowedUrl[2]) {
      return true;
    }

    return url.searchParams.get(allowedUrl[2])?.length > 0;

  }

  return false;
}

/**
 * @param {string} senderId
 * @param {string} link
 * @param {*} prisma
 * @return {Promise}
 */
async function submitChallenge(
  senderId,
  link,
  prisma,
) {
  if (!isValidLink(link)) {
    return {
      success: false,
      message: 'Musi to być link do Youtube lub AnimeThemes.moe!',
    };
  }

  const dailyUser = await prisma.dailyActivity.findMany({
    where: {selected: true},
    orderBy: {count: 'asc'},
    take: 1000
  })[0] || null

  if (!dailyUser || dailyUser.id !== senderId || dailyUser.completed) {
    return {
      success: false,
      message: 'Dzisiaj nie masz zadania lub zostało już wysłane.',
    };
  }



  await prisma.dailyActivity.update({
    where: {id: senderId},
    data: {
      completed: true,
      count: {increment: 1}
    }
  })
  link = cleanUpLinkFromTracking(link);

  return {
    success: true,
    data: {
      prompt: dailyUser.prompt,
      link,
    }
  }
}

module.exports = {
  isValidLink,
  cleanUpLinkFromTracking,
  submitChallenge,
}
