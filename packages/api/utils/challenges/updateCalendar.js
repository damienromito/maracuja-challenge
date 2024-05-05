const { ACTIVITY_TYPES } = require("../../constants")
const { Challenge, QuestionSet, Phase } = require("../../models")
const admin = require("firebase-admin")
const dayjs = require("dayjs")
require("dayjs/locale/fr")
const db = admin.firestore()
dayjs.locale("fr")
const updateChallengeCalendar = async ({ startWelcomeDate, startQuizDate, challengeId }) => {
  const challenge = await Challenge.fetch({ id: challengeId })

  const questionsSets = await QuestionSet.fetchAll({ challengeId }, { refHook: (ref) => ref.where("type", "!=", ACTIVITY_TYPES.ICEBREAKER) })
  if (!questionsSets) return false

  let sortedQuestionsSets = questionsSets.sort((a, b) => a.startDate - b.startDate)

  const questionSetsRef = db.collection("challenges").doc(challengeId).collection("questionSets")

  const getDiffDateFromStart = (diffDayCount) => {
    const newDate = new Date(startQuizDate)
    newDate.setDate(startQuizDate.getDate() + diffDayCount)
    return newDate
  }
  const batch = db.batch()
  let dayDiffFromStartDate = 0
  sortedQuestionsSets.map((qs, i) => {
    if (i === 0) {
      ///Entrainement de bienvenue
      const fromEndDate = getDiffDateFromStart(-1)
      updateQuestionSetDates(qs, { fromStartDate: startWelcomeDate, fromEndDate })
    } else if (i === 1) {
      ///Lancement Challenge = 1er quiz
      updateQuestionSetDates(qs, { fromStartDate: startQuizDate })
    } else {
      //Puis un quiz par jour
      dayDiffFromStartDate += 1

      const previousQuestionSet = sortedQuestionsSets[i - 1]
      //Si le quiz precedent se termine un vendredi, on fait deux jours de pause pendant le week-end
      if (previousQuestionSet.endDate.getDay() === 5) {
        dayDiffFromStartDate += 2
      }
      //Sinon, si le quiz precedent est une épreuve, une jour de pause pour debriefer
      else if (previousQuestionSet.type === ACTIVITY_TYPES.CONTEST) {
        dayDiffFromStartDate += 1
        //si en plus le quiz precedent se termine un jeudi, on fait deux jours de pause pendant le week-end
        if (previousQuestionSet.endDate.getDay() === 4) {
          dayDiffFromStartDate += 2
        }
      }

      const fromStartDate = getDiffDateFromStart(dayDiffFromStartDate)
      updateQuestionSetDates(qs, { fromStartDate })
    }

    batch.update(questionSetsRef.doc(qs.id), {
      startDate: qs.startDate,
      endDate: qs.endDate,
    })
  })

  const endDate = sortedQuestionsSets[sortedQuestionsSets.length - 1].endDate // prettier-ignore

  const periodString = getPeriodString({ startDate: startWelcomeDate, endDate })
  await Challenge.update({ id: challengeId }, { startDate: startWelcomeDate, endDate, periodString })
  await Phase.update({ challengeId, id: sortedQuestionsSets[0].phase.id }, { startDate: startWelcomeDate, endDate })

  return batch.commit()
}

const updateQuestionSetDates = (questionSet, { fromStartDate, fromEndDate }) => {
  if (!fromEndDate) fromEndDate = fromStartDate
  const newStartDate = new Date(fromStartDate)
  newStartDate.setMinutes(questionSet.startDate.getMinutes())
  newStartDate.setHours(questionSet.startDate.getHours())

  const newEndDate = new Date(fromEndDate)
  newEndDate.setMinutes(questionSet.endDate.getMinutes())
  newEndDate.setHours(questionSet.endDate.getHours())

  questionSet.startDate = newStartDate
  questionSet.endDate = newEndDate
}

module.exports = {
  updateChallengeCalendar,
}

const getPeriodString = ({ startDate, endDate }) => {
  let periodString
  if (dayjs(startDate).isSame(endDate, "month")) {
    periodString = dayjs(startDate).format("D")
    periodString += "-" + dayjs(endDate).format("D MMM")
  } else {
    periodString = dayjs(startDate).format("D MMM")
    periodString += " - " + dayjs(endDate).format("D MMM")
  }
  return periodString.toUpperCase()
}
