const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { successResponse } = require("../../utils/response")
const { generateId, objectSubset } = require("../../utils")
const { initMailjet, createMailjetList } = require("../../utils/emails/mailjet")

const db = admin.firestore()

const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { authOnCall } = require("../../utils/functions")

const { Challenge, Team, Club } = require("../../models")
const { USER_ROLES, ACTIVITY_TYPES, MARACUJA_CLUB_ID } = require("../../constants")
const { fetchChallengeDynamicLinkInfo } = require("../../utils/challenges/dynamicLink")
const { generateClubs } = require("../../utils/clubs/generator")
const { cloneChallenge } = require("../../utils/challenges/copy")
const { updateChallengeCalendar } = require("../../utils/challenges/updateCalendar")
const ChallengeSettings = require("../../models/ChallengeSettings")
const { reloadChallengeNotifications } = require("../../db/challenges/questionSets/generatedNotifications")
const { nanoid } = require("nanoid")
const { Configuration, OpenAIApi } = require("openai")
const timestamp = admin.firestore.Timestamp

exports = module.exports = authOnCall({ auth: true }, async (data, context) => {
  let { theme, text, mode, system } = data

  const configuration = new Configuration({
    organization: OPENAI_ORGANIZATION_ID,
    apiKey: OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(configuration)

  let messages
  switch (mode) {
    case "theme":
      messages = [
        { role: "system", content: system || "Tu es un journaliste doit rédiger des articles sur le sujet précisé par l'utilisateur en respectant toutes les consignes ci-dessous : - Le contenu doit être divertissant tout en restant instructif.  - Le texte doit commencer par une phrase accroche intrigante et fun. - Utilise entre 2 et 5 smileys dans tout l'article pour rendre visuel certaines phrases.  - Tres important : Le texte doit faire 80 mots au maximum. " },
        { role: "user", content: "Le sujet à traiter est : " + theme },
      ]
      break
    case "text":
      messages = [
        { role: "system", content: system || "Tu es un journaliste doit rédiger des articles  à partir du texte entré par l'utilisateur en respectant les consignes ci-dessous :Le contenu doit être divertissant tout en restant instructif. Le texte doit commencer par une phrase accroche intrigante et fun. Utilise entre 2 et 5 smileys dans tout l'article pour rendre visuel certaines phrases. Tres important : Le texte doit faire 80 mots au maximum. " },
        { role: "user", content: text },
      ]
      break

    default:
      break
  }

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
  })

  console.dir(completion.data, { depth: null })
  const result = completion.data.choices[0].message?.content
  return successResponse({ result })
})
