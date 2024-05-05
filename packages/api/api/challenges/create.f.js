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
const timestamp = admin.firestore.Timestamp

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  let { name, code, organisationId, clubsGenerator, challengeIdToClone, subCollectionsToClone, startDate, startQuizDate, haveToUpdateCalendar } = data
  startDate = new Date(startDate)
  startQuizDate = new Date(startQuizDate)

  const challengeId = `${organisationId}_${generateId(code !== "NO_CODE" ? code : name)}_${nanoid(2)}`

  await ChallengeSettings.create({ id: "stats", challengeId }, { name })

  let challengeUpdate = {}

  challengeUpdate.endDate = startDate
  let challengeToClone
  if (challengeIdToClone) {
    challengeToClone = await Challenge.fetch({ id: challengeIdToClone })
    challengeUpdate = await cloneChallenge({
      challengeIdToClone,
      subCollectionsToClone,
      challengeId,
    })
  } else {
    await Challenge.create({ id: challengeId })
    await ChallengeSettings.create({ challengeId, id: "general" })
    await ChallengeSettings.create({ challengeId, id: "ranking" })
  }

  challengeUpdate.startDate = startDate
  challengeUpdate.name = name
  challengeUpdate.code = code || "NOCODE"
  challengeUpdate.organisationsIds = [organisationId]

  let heritedParams = {}
  if (challengeToClone) {
    heritedParams = { webAppEnabled: challengeToClone.webAppEnabled, ...objectSubset(challengeToClone.dynamicLink, ["title", "image", "message"]) }
  }
  const params = {
    challengeId,
    ...heritedParams,
  }

  await Challenge.update({ id: challengeId }, challengeUpdate)

  await generateClubs({
    namingType: "random",
    clubsCount: clubsGenerator.count,
    challengeId,
    organisationId,
    haveToCreateMaracujaTeam: true,
  })

  if (haveToUpdateCalendar) {
    await updateChallengeCalendar({ challengeId, startWelcomeDate: startDate, startQuizDate })
  }

  await reloadChallengeNotifications({ challengeId })

  return successResponse({ id: challengeId })
})
