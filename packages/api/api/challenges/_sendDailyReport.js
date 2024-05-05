const { successResponse } = require("../../utils/response")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { Notification } = require("../../models")
const { PLAYER_ROLES, USER_ROLES, ACTIVITY_TYPES } = require("../../constants")
const { authOnCall } = require("../../utils/functions")
const { sendReport, sendCaptainReport } = require("../../utils/challenges/contestReport")
const fs = require("fs")
const { fetchChallengeEmailVariables } = require("../../utils/notifications/email")
const { sortedDatedObjects } = require("../../utils")
const admin = require("firebase-admin")
const { calculateEngagementInChallenge } = require("../../utils/challenges")
const fieldValue = admin.firestore.FieldValue

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  const { challengeId, contestId, phaseId } = data

  await Notification.sendScheduledNotifications()

  return successResponse(true)
})
