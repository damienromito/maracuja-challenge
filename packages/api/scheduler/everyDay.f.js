const functions = require("firebase-functions").region("europe-west1")

const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { Challenge, ChallengeSettings } = require("../models")
const { calculateEngagementInChallenge } = require("../utils/challenges")
const { successResponse } = require("../utils/response")
const admin = require("firebase-admin")
const { sendReport, sendCaptainReport } = require("../utils/challenges/contestReport")
const fieldValue = admin.firestore.FieldValue

exports = module.exports = functions.pubsub
  .schedule("0 8 * * *")
  .timeZone("Europe/Paris")
  .onRun(async (context) => {
    const challenges = await Challenge.fetchAllCurrent({
      hook: (challenge) => {
        console.log("UPDATE ENGAGEMENT IN CURRENT CHALLENGES", challenge.id)
        return calculateEngagementInChallenge({
          challenge,
        })
      },
    })

    if (!challenges) return successResponse(true)
    const promises = challenges.map((challenge) => {
      console.log("SEND CAPTAIN REPORT IN CURRENT CHALLENGES", challenge.id)
      const promise = sendCaptainReport({ challenge })
    })
    await Promise.all(promises)

    return successResponse(true)
  })
