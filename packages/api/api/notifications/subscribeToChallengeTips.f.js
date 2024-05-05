const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { addContactInList } = require("../../utils/emails/mailjet")

const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { Player, ChallengeSettings } = require("../../models")
const { successResponse, errorResponse } = require("../../utils/response")
const { objectSubset } = require("../../utils")
const { authOnCall } = require("../../utils/functions")

const fieldValue = admin.firestore.FieldValue

exports = module.exports = authOnCall({ auth: true }, async (data, context) => {
  const { mailjetListId, player, challengeId } = data
  if (!mailjetListId) return errorResponse()
  // CREATE MAILJET IN LIST
  try {
    await Player.subscribeToChallengeTips({ mailjetListId, player, challengeId })
  } catch (err) {
    error("Error : MailjetList Id not ok", err, player)
  }

  const stats = {
    "notifications.emails.subscriberCount": fieldValue.increment(1),
  }
  await ChallengeSettings.updateStats({ challengeId, teamId: team.id }, stats)

  return successResponse()
})
