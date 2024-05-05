const admin = require("firebase-admin")
const { errorResponse, successResponse } = require("../../utils/response")
const ROLES = require("../../constants/roles")

const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { Game, Player, QuestionSet } = require("../../models")
const { authOnCall } = require("../../utils/functions")

const REFEREE_QUESTION_COUNT_MAX = 3

const ANTI_CHEAT_LIMIT = 3
const WARNING_ANTI_CHEAT_TITLE = `Le réglement interdit l'inscription de plus de ${ANTI_CHEAT_LIMIT} joueurs sur le même téléphone. 👈 `
const WARNING_ANTI_CHEAT_MESSAGE = "D’autres personnes de ton équipe souhaitent participer ? Invite-les à utiliser leur propre téléphone."

const timestamp = admin.firestore.Timestamp

exports = module.exports = authOnCall({ auth: true }, async (data, context) => {
  debug("Start contest:", data)
  const { challengeId, questionSetId, testMode, deviceId, playerId } = data
  const nowDate = timestamp.now().toDate()

  const questionSet = await QuestionSet.fetch({ challengeId, id: questionSetId })

  if (!testMode) {
    // IN TIME
    if (nowDate < questionSet.startDate) {
      const err = {
        message: "Trop tôt, l'épreuve commence bientôt ! 🤗",
        code: "questionSet/too-early",
      }
      return successResponse({ error: err })
    } else if (nowDate > questionSet.endDate) {
      const err = {
        message: "Trop tard, l'épreuve est terminée ! 😕 ",
        code: "questionSet/too-early",
      }
      return successResponse({ error: err })
    }
  }

  const player = await Player.fetch({ challengeId, id: playerId })
  // ADMIN OR EDITOR
  let deviceIdIdenticalCount
  if (!testMode) {
    // Detecter la triche
    deviceIdIdenticalCount = await Game.fetchDeviceIdIdenticalCount({
      deviceId: deviceId || player.deviceId,
      challengeId,
      questionSetId: questionSet.id,
      playerId: player.id,
    })

    if (deviceIdIdenticalCount >= ANTI_CHEAT_LIMIT) {
      const warning = {
        title: "Avertissement",
        message: WARNING_ANTI_CHEAT_TITLE + " " + WARNING_ANTI_CHEAT_MESSAGE,
        code: "anti-cheat/forbidden",
      }
      return successResponse({ warning })
    }

    // HAS ALREADY PLAYED ?
    const playerQuestionSets = player.questionSets

    if (playerQuestionSets?.[questionSet.id]?.games?.length) {
      const warning = {
        message: "Tu as déjà participé à l'épreuve",
        code: "questionSet/already-completed",
      }
      return successResponse({ warning })
    }
  }

  // FLASHCARD IN COMPET
  const warmUpQuestions = []
  const competQuestions = []
  questionSet.questions.forEach((question) => {
    // if(question.type === "card"){
    //   warmUpQuestions.push(question)
    // }else{
    competQuestions.push(question)
    // }
  })

  // RANDOMIZE
  if (!questionSet.disableQuestionsRandomization) {
    questionSet.questions = randomizeArray(competQuestions)
  }

  let questionCountMax = questionSet.questionCountMax

  // REFERRAL
  if (player.roles?.includes(ROLES.REFEREE)) {
    // SELECT QUESTION FOR REFEREES
    questionCountMax = REFEREE_QUESTION_COUNT_MAX
    questionSet.questions = questionSet.questions.filter((q) => Number(q.level) === 1)
  }

  if (warmUpQuestions.length > 0) {
    questionSet.warmUpQuestions = warmUpQuestions
  }

  // QUESTION COUNT MAX
  if (!testMode && questionCountMax && questionCountMax > 0) {
    questionSet.questions = questionSet.questions.slice(0, questionCountMax)
  }

  let error
  if (deviceIdIdenticalCount === 1) {
    error = {
      title: "Avertissement",
      message: WARNING_ANTI_CHEAT_TITLE + " " + WARNING_ANTI_CHEAT_MESSAGE,
      code: "anti-cheat/advertisement",
    }
  }

  questionSet.startedAt = timestamp.now().toDate().toISOString()
  questionSet.buildForApi()
  return successResponse({ questionSet: questionSet, error })
})

const randomizeArray = (arr) => {
  const newArr = arr.slice()
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1))
    ;[newArr[i], newArr[rand]] = [newArr[rand], newArr[i]]
  }
  return newArr
}
