const request = require("request")
const { debug } = require("firebase-functions/lib/logger")

const WEB_API_KEY = "AIzaSyDYf4GGsOYQGj6g_PeaLB48XdsJqDbt3wI" // trouvée ici https://console.firebase.google.com/project/maracuja-english-challenge/settings/general/android:ac.maracuja.challenge

// interface socialMetaTagsTypes {
//   title: string,
//   message: string,
//   image: string
// }

const fetchChallengeDynamicLinkInfo = async ({ challengeId, title, image, message, webAppEnabled = false }) => {
  const socialMetaTags = {
    title: title || "Rejoins-moi sur le challenge !",
    image: image || "https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/placeholder%2FchallengeImage.png?alt=media&token=b7c292d7-c354-47a3-817a-00bc5979c653",
    message: message || "Salut ! Rejoins-moi pour participer au challenge Maracuja ! 🔥",
  }
  const challengeLink = await createDynamicLink({
    link: `https://app.maracuja.ac/${webAppEnabled ? "joinchallenge/" : "mobile-only?c="}${challengeId}`,
    socialMetaTags,
  })
  const code = challengeLink.match(/https:\/\/maracuja\.page\.link\/(.*)/)[1]
  return {
    ...socialMetaTags,
    link: challengeLink,
    code,
  }
}

const createDynamicLink = ({ socialMetaTags, link }) => {
  const body = {
    dynamicLinkInfo: {
      domainUriPrefix: "maracuja.page.link",
      link,
      socialMetaTagInfo: {
        socialTitle: socialMetaTags.title,
        socialDescription: socialMetaTags.message,
        socialImageLink: socialMetaTags.image,
      },
      androidInfo: {
        androidPackageName: "ac.maracuja.challenge",
        // androidFallbackLink: "market://details?id=ac.maracuja.challenge",
      },
      iosInfo: {
        iosBundleId: "ac.maracuja.challenge",
        iosAppStoreId: "1503879184",
        // iosFallbackLink: "itms-apps://apple.com/app/id1503879184",
      },
    },
    suffix: {
      option: "SHORT",
    },
  }

  return new Promise((resolve, reject) => {
    request(
      {
        url: `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${WEB_API_KEY}`,
        method: "POST",
        json: true,
        body,
      },
      function (err, response) {
        if (err) {
          debug("Error :", err)
        } else {
          if (response && response.statusCode !== 200) {
            debug("Error on Request :", response.body.error.message)
          } else {
            resolve(response.body.shortLink)
          }
        }
      }
    )
  })
}

module.exports = {
  fetchChallengeDynamicLinkInfo,
}
