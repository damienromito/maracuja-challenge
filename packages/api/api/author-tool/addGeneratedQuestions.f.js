const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { successResponse } = require("../../utils/response")
const { generateId, objectSubset } = require("../../utils")
const { initMailjet, createMailjetList } = require("../../utils/emails/mailjet")

const db = admin.firestore()

const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { authOnCall } = require("../../utils/functions")

const { Challenge, Team, Club, QuestionSet } = require("../../models")
const { USER_ROLES, ACTIVITY_TYPES, MARACUJA_CLUB_ID } = require("../../constants")
const { fetchChallengeDynamicLinkInfo } = require("../../utils/challenges/dynamicLink")
const { generateClubs } = require("../../utils/clubs/generator")
const { cloneChallenge } = require("../../utils/challenges/copy")
const { updateChallengeCalendar } = require("../../utils/challenges/updateCalendar")
const ChallengeSettings = require("../../models/ChallengeSettings")
const { reloadChallengeNotifications } = require("../../db/challenges/questionSets/generatedNotifications")
const { nanoid } = require("nanoid")
const { Configuration, OpenAIApi } = require("openai")
const Themes = require("../../models/Theme")
const timestamp = admin.firestore.Timestamp
const fieldValue = admin.firestore.FieldValue

exports = module.exports = authOnCall({ auth: true }, async (data, context) => {
  let { themeId, questions, organisationId } = data

  const builtQuestions = questions.map((question) => buildQuestion(question))
  console.log("builtQuestions:", builtQuestions)

  await Themes.update({ id: themeId, organisationId }, { questions: fieldValue.arrayUnion(...builtQuestions) })

  return successResponse()
})

const buildQuestion = (question) => {
  return {
    text: question.text,
    choices: question.choices.join("|"),
    solutions: question.choices[question.solution],
    type: "mcq-text",
    id: "MCQ_" + nanoid(8) + "_AI",
  }
}
