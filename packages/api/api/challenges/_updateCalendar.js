const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { successResponse } = require("../../utils/response")
const { generateId } = require("../../utils")
const { initMailjet, createMailjetList } = require("../../utils/emails/mailjet")

const db = admin.firestore()

const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { authOnCall } = require("../../utils/functions")

const { Challenge, Team, Club } = require("../../models")
const { USER_ROLES, ACTIVITY_TYPES, MARACUJA_CLUB_ID } = require("../../constants")
const { updateChallengeCalendar } = require("../../utils/challenges/updateCalendar")

const timestamp = admin.firestore.Timestamp

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  let { challengeId, startWelcomeDate, startQuizDate } = data

  startWelcomeDate = new Date(startWelcomeDate)
  startQuizDate = new Date(startQuizDate)

  await updateChallengeCalendar({ challengeId, startWelcomeDate, startQuizDate })

  return successResponse({ id: challengeId })
})
