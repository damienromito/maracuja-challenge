const admin = require("firebase-admin")
const { errorResponse, successResponse } = require("../../utils/response")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { QuestionSet, Game } = require("../../models")
const { authOnCall } = require("../../utils/functions")
const { ACTIVITY_TYPES } = require("../../constants")

const timestamp = admin.firestore.Timestamp

exports = module.exports = authOnCall({ auth: true }, async (data, context) => {
  debug("Start training:", data)

  const { challengeId, questionSetId, testMode, keepProgression, playerId } = data
  const nowDate = timestamp.now().toDate()

  const training = await QuestionSet.fetch({ challengeId, id: questionSetId })
  training.questionCount = training.questions.length
  // if (!testMode) { //PERMET DE REFAIRE UN ENTRAINEMENT
  //   // IN TIME
  //   if (nowDate < training.startDate) {
  //     const err = {
  //       message: "Trop tôt, l'épreuve commence bientôt ! 🤗",
  //       code: "questionSet/too-early",
  //     }
  //     return successResponse({ error: err })
  //   } else if (nowDate > training.endDate) {
  //     const err = {
  //       message: "Trop tard, l'épreuve est terminée ! 😕 ",
  //       code: "questionSet/too-early",
  //     }
  //     return successResponse({ error: err })
  //   }
  // }

  if (keepProgression) {
    const lastGame = await Game.fetchLastGame({ challengeId, playerId, questionSetId, activityType: ACTIVITY_TYPES.TRAINING })
    const questions = []
    //TODO is pas d'answer
    lastGame.answers?.forEach((answer) => {
      const question = training.questions.find((question) => question.id === answer.id)
      if (!answer.isCorrect || question?.type === "card") {
        question && questions.push(question)
      }
    })

    training.questions = questions
    training.keepProgression = true
  }

  training.buildForApi()
  return successResponse({ questionSet: training })
})
