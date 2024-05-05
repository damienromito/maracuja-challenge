/*********WARNING*************/
//NE PAS EXPOSER EN PRODUCTION//
/*********WARNING*************/
const moment = require("moment")

const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { parseAsync } = require("json2csv")
const { ACTIVITY_TYPES } = require("../constants")
const { Player, Challenge, QuestionSet } = require("../models")
const { successResponse } = require("../utils/response")
const { buildCSVFile } = require("../utils/dbExport")

const runtimeOpts = {
  timeoutSeconds: 540,
  memory: "2GB",
}

exports = module.exports = functions.runWith(runtimeOpts).https.onCall(async (data, context) => {
  const { challengeId, exportCSV } = data

  // const challenge = await Challenge.fetch({id : challengeId})
  const questionSets = await QuestionSet.fetchAll({ challengeId })

  // const players = []
  const players = await Player.fetchAll(
    { challengeId },
    {
      refHook: (ref) => ref, //.where('acceptNotification', '==', false)
    }
  )

  let questionSetsToCompare = []
  Object.keys(questionSets).map((key) => {
    const qs = questionSets[key]
    if (qs.type === ACTIVITY_TYPES.CONTEST) {
      questionSetsToCompare.push(qs)
    }
  })

  questionSetsToCompare = questionSetsToCompare.sort((a, b) => a.startDate - b.startDate)

  const comparaisons = []
  questionSetsToCompare.forEach((questionSet1, index) => {
    if (index < questionSetsToCompare.length - 1) {
      const questionSet2 = questionSetsToCompare[index + 1]
      const comparaison = getQuizComparaison({ players, questionSet1, questionSet2 })
      comparaison.challengeId = challengeId
      comparaisons.push(comparaison)
    }
  })

  const csvLines = await parseAsync(comparaisons)

  let fileUrl
  if (exportCSV) {
    fileUrl = await buildCSVFile({ collection: "engagment", challengeId, csvLines })
  }

  return successResponse({ fileUrl, comparaisons })
})

const getQuizComparaison = ({ players, questionSet1, questionSet2 }) => {
  var a = moment(questionSet1.startDate).startOf("day")
  var b = moment(questionSet2.startDate).startOf("day")
  const dayDifference = moment.duration(b.diff(a)).asDays()
  const phaseId1 = questionSet1.phase.id
  const phaseId2 = questionSet2.phase.id

  //avec notif
  let quiz1PlayerCountNotif = 0
  let quiz2EngagedPlayerCountNotif = 0
  let sumQuiz1ScoresNotif = 0

  //Sans notif
  let quiz1PlayerCount = 0
  let quiz2EngagedPlayerCount = 0
  let sumQuiz1Scores = 0

  // let sumQuiz1AnswerCount = 0 //TODO en fonciton du nombre d'erreur
  players.map((player) => {
    const qs1Score = player.getContestScore({ phaseId: phaseId1, id: questionSet1.id })
    if (qs1Score) {
      // sumQuiz1AnswerCount += q
      if (player.acceptNotification) {
        sumQuiz1ScoresNotif += qs1Score.score
        quiz1PlayerCountNotif++
      } else {
        sumQuiz1Scores += qs1Score.score
        quiz1PlayerCount++
      }
      const qs2Score = player.getContestScore({ phaseId: phaseId2, id: questionSet2.id })
      if (qs2Score) {
        if (player.acceptNotification) {
          quiz2EngagedPlayerCountNotif++
        } else {
          quiz2EngagedPlayerCount++
        }
      }
    }
  })

  const quiz1ScoreAverage = quiz1PlayerCount ? sumQuiz1Scores / quiz1PlayerCount : 0
  const quiz1ScoreAverageNotif = sumQuiz1ScoresNotif / quiz1PlayerCountNotif
  const quiz1MaxScore = questionSet1.questionCountMax || questionSet1.questions.length

  return {
    quiz: questionSet1.name,
    startDate: moment(questionSet1.startDate).format("DD/MM/YYYY H:mm"),
    type: questionSet1.type,
    nextQuiz: questionSet2.name,
    dayDifference,
    quiz1Duration: questionSet1.duration,
    quiz1MaxScore,
    quiz1PlayerCount,
    sumQuiz1Scores,
    quiz1ScoreAverage,

    difficultyNotif: 1 - quiz1ScoreAverageNotif / quiz1MaxScore,
    difficulty: 1 - quiz1ScoreAverage / quiz1MaxScore,
    engagmentNotif: quiz2EngagedPlayerCountNotif / quiz1PlayerCountNotif,
    engagment: quiz2EngagedPlayerCount / quiz1PlayerCount,
  }
}
