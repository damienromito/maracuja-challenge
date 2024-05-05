const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { successResponse } = require("../../utils/response")
const { generateId } = require("../../utils")
const { initMailjet, createMailjetList } = require("../../utils/emails/mailjet")
const { nanoid } = require("nanoid")
const db = admin.firestore()

const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { authOnCall } = require("../../utils/functions")
const { USER_ROLES } = require("../../constants")
const { Team, Club, ChallengeSettings } = require("../../models")
const { generateClubs } = require("../../utils/clubs/generator")
const fieldValue = admin.firestore.FieldValue

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  const { clubsCount, namingType, challengeId, organisationId, haveToCreateMaracujaTeam } = data

  await generateClubs({
    clubsCount,
    namingType,
    challengeId,
    organisationId,
    haveToCreateMaracujaTeam,
  })

  return successResponse({ id: challengeId })
})
