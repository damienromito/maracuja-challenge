const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { Player, QuestionSet, Challenge, Team, User } = require("../models")
const { ACTIVITY_TYPES } = require("../constants")
const { objectSubset } = require(".")
const db = admin.firestore()
const fieldValue = admin.firestore.FieldValue
const timestamp = admin.firestore.Timestamp

const createIcebreakerQuiz = async ({ challengeId, teamId, question }) => {
  const challenge = await Challenge.fetch({ id: challengeId })
  const questionSetPhase = challenge.sortedPhases()[0]
  const questionSet = {
    name: "Découvre tes coéquipiers",
    description: "Voici un petit défis pour découvrir les joueurs de ton équipe ! ❓ Comment ajouter une question sur toi ? Clique sur “Crée ta question”",
    startDate: challenge.startDate,
    endDate: challenge.endDate,
    duration: 0,
    authorizedTeams: [teamId],
    phase: objectSubset(questionSetPhase, ["id", "name", "type"]),
    phaseId: questionSetPhase.id,
    questions: [question],
    type: ACTIVITY_TYPES.ICEBREAKER,
    audienceRestricted: true,
  }
  const questionSetId = `icebreaker_${teamId}`
  await QuestionSet.create({ challengeId, id: questionSetId }, questionSet)
  return questionSetId
}

const buildIcebreakerQuestion = ({ player, truth1, truth2, lie }) => {
  return {
    text: `2 anecdotes sur ${player.username} sont vraies, lesquelles ?`,
    choices: `${truth1}|${truth2}|${lie}`,
    solutions: `${truth1}|${truth2}`,
    type: "mcq-text",
    image: player.avatar?.["400"] || player.avatar?.original || null,
    id: player.id,
  }
}

const addQuestionToIcebreaker = async ({ challengeId, teamId, question, playerId }) => {
  const questionSet = await QuestionSet.fetchTeamExclusive({
    challengeId,
    teamId,
    type: ACTIVITY_TYPES.ICEBREAKER,
  })

  let newQuestionSetId, questionAlreadyExists
  if (!questionSet) {
    newQuestionSetId = await createIcebreakerQuiz({ challengeId, teamId, question })
  } else {
    // Supprime l'ancienne question du joueur si elle existe
    questionSet.questions = questionSet.questions.filter(function (q) {
      if (q.id !== playerId) {
        return true
      } else {
        questionAlreadyExists = true
        return false
      }
    })
    questionSet.questions.unshift(question)
    await QuestionSet.update({ challengeId, id: questionSet.id }, questionSet)
  }
  return { questionAlreadyExists, newQuestionSetId }
}

module.exports = {
  createIcebreakerQuiz,
  buildIcebreakerQuestion,
  addQuestionToIcebreaker,
}
