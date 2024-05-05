const functions = require("firebase-functions").region("europe-west1")
const ROLES = require("../../../constants/roles")
const admin = require("firebase-admin")
const { MARACUJA_CLUB_ID } = require("../../../constants")
const { ChallengeSettings } = require("../../../models")

exports = module.exports = functions.firestore.document("challenges/{challengeId}/players/{playerId}").onCreate(async (snap, context) => {
  const challengeId = context.params.challengeId
  const db = admin.firestore()
  const FieldValue = admin.firestore.FieldValue

  const player = snap.data()

  const newStats = {}
  newStats.playerCount = FieldValue.increment(1)
  if (player.roles?.includes(ROLES.REFEREE)) {
    newStats.refereeCount = FieldValue.increment(1)
  } else if (player.roles?.includes(ROLES.CAPTAIN)) {
    newStats.captainCount = FieldValue.increment(1)
  }

  await ChallengeSettings.updateStats({ challengeId, teamId: player.club.id }, newStats)
  return true
})
