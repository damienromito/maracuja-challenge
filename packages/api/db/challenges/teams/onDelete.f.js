const { debug, info, error, warn } = require("firebase-functions/lib/logger")

const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { ChallengeSettings } = require("../../../models")

exports = module.exports = functions.firestore.document("challenges/{challengeId}/teams/{teamId}").onDelete(async (snap, context) => {
  const FieldValue = admin.firestore.FieldValue
  const db = admin.firestore()
  const challengeId = context.params.challengeId
  const teamId = context.params.teamId

  let stats = {}
  stats["teamCount"] = FieldValue.increment(-1)
  console.log("stats:", stats)

  await ChallengeSettings.updateStats({ challengeId, teamId }, stats)
})
