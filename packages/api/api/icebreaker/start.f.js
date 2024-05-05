const admin = require('firebase-admin')
const { errorResponse, successResponse } = require('../../utils/response')
const { debug, info, error, warn } = require('firebase-functions/lib/logger')
const { QuestionSet, Game } = require('../../models')
const { authOnCall } = require('../../utils/functions')
const { ACTIVITY_TYPES } = require('../../constants')

exports = module.exports = authOnCall({ auth: true }, async (data, context) => {
  debug('Start training:', data)

  const { challengeId, questionSetId, keepProgression, playerId } = data

  const icebreaker = await QuestionSet.fetch({ challengeId, id: questionSetId })
  icebreaker.questionCount = icebreaker.questions?.length || 0

  if (keepProgression) {
    const lastGame = await Game.fetchLastGame({ challengeId, playerId, questionSetId, activityType: ACTIVITY_TYPES.ICEBREAKER })
    const questions = []
    // Add incorrect answers questions => Probleme rajoute toutes les questions deja répondues
    // training.questions.forEach(question => {
    //   const answer = lastGame.answers?.find(answer => question.id === answer.id)
    //   if (answer) {
    //     if (question?.type === 'card' || !answer.isCorrect) questions.push(question)
    //   } else {
    //     questions.push(question)
    //   }
    // })

    lastGame.answers?.forEach(answer => {
      const question = icebreaker.questions.find(question => question.id === answer.id)
      if (!answer.isCorrect || question?.type === 'card') {
        question && questions.push(question)
      }
    })
    icebreaker.questions = questions
    icebreaker.keepProgression = true
  }

  icebreaker.buildForApi()
  return successResponse({ questionSet: icebreaker })
})
