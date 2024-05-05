const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { calculRankingsInCurrentChallenges } = require("../../utils/rankings")

const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { authOnCall } = require("../../utils/functions")
const { USER_ROLES } = require("../../constants")

exports = module.exports = authOnCall({ role_: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  const { challengeId } = data
  // if (challengeId) {
  //   const challenge = await Challenge.fetch({ id: challengeId })
  //   console.log("challenge:", challenge.id)
  //   await calculInChallenge({ challenge })
  //   return successResponse()
  // }

  try {
    await calculRankingsInCurrentChallenges()
  } catch (err) {
    error("Error getting rankingsCalculate", err)
  }
})
