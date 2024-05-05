const { successResponse } = require("../../utils/response")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { USER_ROLES, MARACUJA_CLUB_ID } = require("../../constants")
const { authOnCall } = require("../../utils/functions")
const { calculateEngagementInChallenge } = require("../../utils/challenges")
const { Challenge } = require("../../models")

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  const { challengeId } = data

  await Challenge.fetchAllCurrent({
    hook: (challenge) => {
      return calculateEngagementInChallenge({
        challenge,
      })
    },
  })

  return successResponse(true)
})
