const { errorResponse, successResponse } = require("../../utils/response")

const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { objectSubset } = require("../../utils")
const { Game, QuestionSet } = require("../../models")
const { ACTIVITY_TYPES } = require("../../constants")
const { authOnCall } = require("../../utils/functions")

exports = module.exports = authOnCall({ auth: true }, async (data, context) => {
  const { challengeId, contestId, playerId, keepProgression } = data
  // const nowDate = timestamp.now().toDate()
  debug(data)
  // get questionset
  const contest = await QuestionSet.fetch({ challengeId, id: contestId })
  // build debriefing
  const debriefing = {
    ...objectSubset(contest, ["id", "name"]),
    type: ACTIVITY_TYPES.DEBRIEFING,
    description: "C’est l’heure du debriefing, revois toutes tes erreurs pour assurer la prochaine fois",
    phase: contest.phase,
    duration: 0,
    startDate: contest.startDate.toISOString(),
  }

  const questions = []

  const fetchLastGame = ({ activityType }) => {
    return Game.fetchLastGame({ challengeId, playerId, questionSetId: contestId, activityType })
  }

  const getIncorrectQuestions = ({ answers }) => {
    const questions = []
    answers?.forEach((answer) => {
      if (!answer.isCorrect) {
        const question = contest.questions.find((question) => question.id === answer.id)
        question && questions.push(question)
      }
    })
    return questions
  }

  if (keepProgression) {
    const lastDebriefingParticipation = await fetchLastGame({ activityType: ACTIVITY_TYPES.DEBRIEFING })
    debriefing.questionCount = lastDebriefingParticipation.questionSet.questionCount
    debriefing.questions = getIncorrectQuestions({ answers: lastDebriefingParticipation.answers })
    debriefing.keepProgression = true
  } else {
    const lastContestParticipation = await fetchLastGame({ activityType: ACTIVITY_TYPES.CONTEST })
    const questions = getIncorrectQuestions({ answers: lastContestParticipation.answers })
    // Add Unanswered questions
    lastContestParticipation.unAnsweredQuestionsIds?.map((ua) => {
      const question = contest.questions.find((question) => question.id === ua)
      question && questions.push(question)
    })

    debriefing.questionCount = questions.length
    debriefing.questions = questions
  }
  debug("debriefing sent " + playerId)
  debriefing.questions.map((q) => {
    delete q.createdAt
    delete q.editedAt
  })
  return successResponse({ questionSet: debriefing })
})
