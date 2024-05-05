const { successResponse } = require("../../utils/response")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { USER_ROLES, MARACUJA_CLUB_ID, ACTIVITY_TYPES } = require("../../constants")
const { authOnCall } = require("../../utils/functions")
const { calculateEngagementInChallenge } = require("../../utils/challenges")
const { Challenge, QuestionSet } = require("../../models")
const { manageGeneratedNotifications, reloadChallengeNotifications } = require("../../db/challenges/questionSets/generatedNotifications")
const admin = require("firebase-admin")

const db = admin.firestore()

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  const { challengeId } = data

  await reloadChallengeNotifications({ challengeId })

  return successResponse(true)
})
