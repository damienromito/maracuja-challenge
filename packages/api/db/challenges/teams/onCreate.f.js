const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { ChallengeSettings } = require("../../../models")

exports = module.exports = functions.firestore.document("challenges/{challengeId}/teams/{teamId}").onCreate((snap, context) => {
  const FieldValue = admin.firestore.FieldValue
  const db = admin.firestore()
  const challengeId = context.params.challengeId

  const newStats = { teamCount: FieldValue.increment(1) }
  return ChallengeSettings.updateStats({ challengeId, teamId: snap.id }, newStats)
})
