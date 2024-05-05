import PHASE_TYPES from '@maracuja/shared/constants/phaseTypes'
import { objectSubset } from '@maracuja/shared/helpers'

const initTimer = ({ timer, startValue, duration, timerTargetAchieved, timerSecondsUpdated }) => {
  const timerConfig = {
    countdown: duration > 0,
    startValues: { seconds: startValue }
  }
  if (timerConfig.countdown) {
    timerConfig.target = { seconds: 0 }
  }
  timer.start(timerConfig)
  timer.pause()
  timer.addEventListener('targetAchieved', timerTargetAchieved)
  timer.addEventListener('secondsUpdated', timerSecondsUpdated)

  return () => {
    timer.removeEventListener('secondsUpdated', timerSecondsUpdated)
    timer.removeEventListener('targetAchieved', timerTargetAchieved)
  }
}

const getInitialStates = (id, duration) => {
  let answers, questionSetId, currentQuestionIndex,
    correctCount, initialTime, isNewGame

  let savedStatesData
  // if(duration > 0){//GET OLD STATE IF TIMED QUESTIONQET
  savedStatesData = getStatesIfAlreadyStartedGame(id)
  // }

  if (savedStatesData) {
    answers = savedStatesData.answers
    questionSetId = savedStatesData.questionSetId
    currentQuestionIndex = savedStatesData.currentQuestionIndex + 1
    correctCount = savedStatesData.correctCount
    initialTime = savedStatesData.time
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
  return { answers, questionSetId, currentQuestionIndex, correctCount, initialTime, isNewGame }
}

const createGame = ({
  questionSet, player, answers,
  duration, phase, team, completedAt, correctCount, challengeId
}) => {
  const gameData = {
    questionSet: objectSubset(questionSet, ['id', 'name', 'endDate', 'startDate'], true),
    challengeId: challengeId,
    answers: answers,
    answerCount: answers.length,
    correctCount: correctCount,
    questionCount: questionSet.questions.length,
    duration: duration,
    progression: correctCount / questionSet.questions.length,
    player: objectSubset(player, ['id', 'username', 'firstName', 'roles']),
    team: objectSubset(team, ['id', 'name', 'image']),
    completedAt: completedAt.toISOString()
  }

  if (phase) {
    gameData.phase = objectSubset(phase, [
      'id', 'name', 'type',
      'topReferees', 'rankingFilters',
      'questionSetCount', 'questionSetCount'
    ])
  } else {
    gameData.phase = objectSubset(questionSet.phase, ['id', 'name', 'type'])
  }

  return gameData
}

const getStatesIfAlreadyStartedGame = (questionSetId) => {
  const savedStatesFromStorage = JSON.parse(localStorage.getItem('savedStates'))

  if (savedStatesFromStorage && savedStatesFromStorage.questionSetId === questionSetId) {
    return savedStatesFromStorage
  } else {
    return false
  }
}

// const preloadQuestionsImages = (questions) =>{
//   questions.forEach(q => {
//     if(q.type === "mcq-images" && q.mcqImagesChoices){
//       let Images = q.mcqImagesChoices.split('|')
//       let urlImages = []
//       Images.forEach(picture => {
//         urlImages.push(preloadImage(picture))
//       })
//       q.mcqImagesChoices = urlImages.join('|')
//     }
//     if(q.image) {
//       q.image = preloadImage(q.image)
//     }
//   })
//   return questions
// }

// const preloadQuestionsImages = async (questions) => {
//   const urlImages = []
//   questions.forEach(q => {
//     if (q.type === 'mcq-images' && q.mcqImagesChoices) {
//       const Images = q.mcqImagesChoices.split('|')
//       Images.forEach(picture => {
//         urlImages.push(picture)
//       })
//     }
//     if (q.image) {
//       urlImages.push(q.image)
//     }
//   })

//   const promises = await urlImages.map(src => {
//     return new Promise(function (resolve, reject) {
//       const img = new Image()
//       img.src = src
//       img.onload = resolve
//       img.onerror = reject
//     })
//   })
//   console.log('IMAGE TO PRELOAD', urlImages)

//   return Promise.all(promises)
// }

export {
  initTimer,
  getInitialStates,
  createGame
  // preloadQuestionsImages
}
