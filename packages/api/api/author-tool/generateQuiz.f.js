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
  let { text, system } = data

  const configuration = new Configuration({
    organization: OPENAI_ORGANIZATION_ID,
    apiKey: OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(configuration)

  //Ajoute une mauvaise solution qui peut etre une blague ou un jeu de mot.
  const systemRule = system || "Tu es un générateur de QCM pédagogique à partir du texte entré par l’utilisateur. Génere entre 2 et 5 QCM contenant 3 solutions dont une seule bonne réponse. Chaque solution ne doit pas faire plus de 15 mots. Indique laquelle est bonne. La position de la bonne réponse doit être aléatoire pour ne pas toujours être à la même place."
  const formatRule = `Ta réponse doit etre au format json suivant [{ "text":"la question", choices : ["réponse 1","réponse 2", "réponse 3"] , solution : 2}, ...]`

  let messages = [
    { role: "system", content: systemRule + formatRule },
    { role: "user", content: text },
  ]

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
  })

  console.dir(completion.data, { depth: null })
  const result = JSON.parse(completion.data.choices[0].message?.content)
  console.log("result:", result)
  return successResponse({ result })
})
