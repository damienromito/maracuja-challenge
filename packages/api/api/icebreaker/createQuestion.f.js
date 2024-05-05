const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { errorResponse, successResponse } = require("../../utils/response")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { objectSubset, stringToId } = require("../../utils")
const { Player, QuestionSet, Challenge, Team, User, ChallengeSettings } = require("../../models")
const { ACTIVITY_TYPES, MARACUJA_CLUB_ID } = require("../../constants")
const { createIcebreakerQuiz, addQuestionToIcebreaker, buildIcebreakerQuestion } = require("../../utils/icebreaker")
const { authOnCall } = require("../../utils/functions")
const db = admin.firestore()
const fieldValue = admin.firestore.FieldValue
const timestamp = admin.firestore.Timestamp

exports = module.exports = authOnCall({ auth: true }, async (data, context) => {
  debug("data:", data)
  const { truth1, truth2, lie, playerId, challengeId } = data

  if (!playerId) successResponse({ error: { message: "PlayerID is missing" } })

  const player = await Player.fetch({ challengeId, id: playerId })

  const teamId = player.club.id

  const newTeam = {}
  const stats = {}

  const newQuestion = buildIcebreakerQuestion({ player, truth1, truth2, lie })
  const actionInfo = await addQuestionToIcebreaker({ challengeId, teamId, question: newQuestion, playerId })

  if (actionInfo.newQuestionSetId) {
    newTeam["icebreaker.questionSetId"] = actionInfo.newQuestionSetId
    stats["icebreaker.quizCount"] = fieldValue.increment(1)
  }

  if (!actionInfo.questionAlreadyExists) {
    newTeam["icebreaker.questionCount"] = fieldValue.increment(1)
    stats["icebreaker.questionCount"] = fieldValue.increment(1)
  }

  // Update team
  newTeam["icebreaker.questionCreationCount"] = fieldValue.increment(1)
  stats["icebreaker.questionCreationCount"] = fieldValue.increment(1)
  await Team.update({ id: teamId, challengeId }, newTeam)

  await player.update({
    "icebreaker.questionCreationCount": fieldValue.increment(1),
  })

  // save icebreaker in user data
  await User.update({ id: player.id }, { "icebreaker.question": newQuestion })

  // TODO : Create question in user
  await db
    .collection("users")
    .doc(playerId)
    .update({
      icebreakerQuestion: objectSubset(newQuestion, ["choices", "solutions"]),
    })

  await ChallengeSettings.updateStats({ challengeId, teamId }, stats)

  return successResponse()
})
