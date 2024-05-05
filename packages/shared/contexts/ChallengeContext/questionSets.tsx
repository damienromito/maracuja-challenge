/*
 * SHARED CONTEXT
 * 4/01/21
 */

import moment from "moment"
import { currentDate } from "../../helpers"
import { QuestionSet } from "../../models"

const initQuestionSets = ({ challengeQuestionSets, playerQuestionSets, clubId }) => {
  if (!challengeQuestionSets) return null

  const questionSetsData = []
  for (const key of Object.keys(challengeQuestionSets)) {
    const challengeQuestionSet = challengeQuestionSets[key]
    if (challengeQuestionSet.authorizedTeams?.length > 0 && !challengeQuestionSet.authorizedTeams.includes(clubId)) {
      continue
    }
    const questionSet = {
      ...challengeQuestionSet,
      ...(playerQuestionSets ? getPlayerQuestionSet(playerQuestionSets[key]) : null),
    }

    if (typeof questionSet._stats?.lastParticipationAt?.toDate === "function") {
      questionSet._stats.lastParticipationAt = questionSet._stats.lastParticipationAt.toDate()
    }

    const questionSetData = {
      ...questionSet,
      // ...getQuestionSetCurrentActivity(questionSet.startDate, questionSet.endDate),
      id: key,
    }
    questionSetsData.push(new QuestionSet(questionSetData))
  }

  // questionSetsData = questionSetsData.map(questionSet => {
  //   questionSet.startDate = questionSet.startDate.toDate()
  //   questionSet.endDate = questionSet.endDate.toDate()
  // })
  questionSetsData.sort((a, b) => a.startDate - b.startDate)
  return questionSetsData
}

const getPlayerQuestionSet = (questionSet) => {
  if (questionSet?._stats) {
    if (questionSet._stats.count) {
      questionSet.hasPlayed = true
    } else {
      questionSet._stats.score = null
      questionSet.hasPlayed = false
    }
  }
  return questionSet
}

const getNextQuestionSet = ({ questionSets, type = false }) => {
  if (!questionSets?.length) return false
  for (let i = 0; i < questionSets.length; i++) {
    const questionSet = questionSets[i]
    if (questionSet.startDate < currentDate()) continue
    if (type) {
      if (questionSet.type === type) return questionSet
      continue
    }
    return questionSet
  }
  return false
}

const getPreviousQuestionSet = ({ questionSets }) => {
  if (!questionSets?.length) return false
  for (let i = questionSets.length - 1; i >= 0; i--) {
    const questionSet = questionSets[i]
    if (questionSet.endDate > currentDate()) continue
    return questionSet
  }
  return false
}

const getNeareastQuestionSet = ({ questionSets }) => {
  const today = new Date()
  const previousQuestionSet = getPreviousQuestionSet({ questionSets })
  const nextQuestionSet = getNextQuestionSet({ questionSets })
  if (-moment(today).diff(nextQuestionSet.startDate) > moment(today).diff(previousQuestionSet.endDate)) {
    return previousQuestionSet
  } else {
    return nextQuestionSet
  }
}

export { initQuestionSets, getNextQuestionSet, getPreviousQuestionSet, getNeareastQuestionSet }
