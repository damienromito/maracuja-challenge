const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const db = admin.firestore()

const fs = require("fs") // Filesystem
const { ChallengeStats } = require("../../models")
const { sendEmailNotifications } = require("../../utils/notifications/email")
const { successResponse } = require("../../utils/response")

exports = module.exports = functions.https.onCall(async (data, context) => {
  var content = fs.readFileSync("./data/emails/notification.html", "utf-8")
  const email = {
    To: [
      {
        Email: "test@maracuja.ac",
      },
    ],
    Subject: "Ceci est un test",
    HTMLPart: content,
    TemplateLanguage: true,
    Variables: {
      title: "Titre test",
      message: "Voici le message de test",
      challengeImageUrl: "https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/badge%2Fsopna.png?alt=media&token=1cbbb8b5-414d-43ac-9430-8f58091749fe",
      buttonLink: "https://maracuja.page.link/jib2022",
      buttonText: "Ouvrir l'app",
      primaryColor: "#2C29AB",
      secondaryColor: "#F37B21",
    },
  }

  await sendEmailNotifications({ emails: [email] })

  return successResponse()
})
