import { objectSubset } from "@maracuja/shared/helpers"
import { ACTIVITY_TYPES } from "@maracuja/shared/constants"

const initTimer = ({ timer, startValue, duration, timerTargetAchieved, timerSecondsUpdated }) => {
  const timerConfig: any = {
    countdown: duration > 0,
    startValues: { seconds: startValue },
  }
  if (timerConfig.countdown) {
    timerConfig.target = { seconds: 0 }
  }
  timer.start(timerConfig)
  timer.pause()
  timer.addEventListener("targetAchieved", timerTargetAchieved)
  timer.addEventListener("secondsUpdated", timerSecondsUpdated)

  return () => {
    timer.removeEventListener("secondsUpdated", timerSecondsUpdated)
    timer.removeEventListener("targetAchieved", timerTargetAchieved)
  }
}

const getInitialStates = ({ id, duration, startedAt }) => {
  let answers, questionSetId, currentQuestionIndex, correctCount, initialTime, isNewGame

  const savedStatesData = getStatesIfAlreadyStartedGame(id)

  if (savedStatesData) {
    answers = savedStatesData.answers
    questionSetId = savedStatesData.questionSetId
    currentQuestionIndex = savedStatesData.currentQuestionIndex + 1
    correctCount = savedStatesData.correctCount
    initialTime = savedStatesData.time
    savedStatesData.startedAt && (startedAt = new Date(savedStatesData.startedAt))
    isNewGame = false
    // TODO METTRE LES ANCIENNES QUESTIONS (car si les question sont aleatoirement chargé, l'utilisateurs aura d'autres questions)
  } else {
    answers = []
    questionSetId = id
    currentQuestionIndex = 0
    correctCount = 0
    initialTime = duration
    isNewGame = true
  }
  return { answers, questionSetId, currentQuestionIndex, correctCount, initialTime, isNewGame, startedAt }
}

const createGame = ({
  questionSet,
  player,
  answers,
  duration,
  phase,
  team,
  completedAt,
  correctCount,
  challengeId,
}) => {
  const answerCount = answers.length
  const questionCount = questionSet.questions.length
  let unAnsweredQuestionsIds
  if (questionSet.type === ACTIVITY_TYPES.CONTEST && answerCount < questionCount) {
    unAnsweredQuestionsIds = questionSet.questions.slice(answerCount).map((q) => q.id)
  }

  let progression
  if (questionSet.keepProgression) {
    const totalCorrectCount = questionSet.questionCount - questionCount + correctCount
    progression = totalCorrectCount / questionSet.questionCount
  } else {
    progression = correctCount / questionCount
  }

  const gameData: any = {
    questionSet: objectSubset(
      questionSet,
      ["id", "name", "endDate", "startDate", "type", "audienceRestricted", "questionCount", "keepProgression"],
      true
    ),
    challengeId,
    answers,
    unAnsweredQuestionsIds,
    answerCount,
    correctCount,
    questionCount,
    duration: duration,
    progression,
    player: objectSubset(player, ["id", "username", "firstName", "roles"]),
    team: objectSubset(team, ["id", "name", "image"]),
    completedAt: completedAt.toISOString(),
  }

  gameData.phase = objectSubset(phase, [
    "id",
    "name",
    "type",
    "topReferees",
    "rankingFilters",
    "trainingCount",
    // 'contestCount'
  ])

  return gameData
}

const getStatesIfAlreadyStartedGame = (questionSetId) => {
  const savedStatesFromStorage = JSON.parse(localStorage.getItem("savedStates"))

  if (savedStatesFromStorage && savedStatesFromStorage.questionSetId === questionSetId) {
    return savedStatesFromStorage
  } else {
    return false
  }
}

export {
  initTimer,
  getInitialStates,
  createGame,
  // preloadQuestionsImages
}
