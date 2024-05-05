const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const db = admin.firestore()

const fs = require("fs") // Filesystem
const { ChallengeStats, Challenge, Ranking } = require("../../models")
const { calculateEngagementInChallenge } = require("../../utils/challenges")
const { sendCaptainReport } = require("../../utils/challenges/contestReport")
const { sendEmailNotifications } = require("../../utils/notifications/email")
const { successResponse } = require("../../utils/response")

exports = module.exports = functions.https.onCall(async (data, context) => {
  const challengeId = "crditagricoleaquitaine_a_villageca"
  const phaseId = "phase3_V"
  const rankings = await Ranking.fetchAll({ challengeId }, { refHook: (ref) => ref.where("phase.id", "=", phaseId) })
  const promises = rankings.map((ranking) => {
    return ranking.delete()
  })

  await Promise.all(promises)

  return successResponse()
})
