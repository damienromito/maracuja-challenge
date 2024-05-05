import { IonPage } from "@ionic/react"
import { ACTIVITY_TYPES, QUESTION_TYPES, ROLES, USER_ROLES } from "@maracuja/shared/constants"
import Timer from "easytimer.js"
import React, { useContext, useEffect, useState } from "react"
import { useHistory, useLocation, useRouteMatch } from "react-router-dom"
import { GameQuestion, Spinner } from "../../components"
import { GameContext, useAuthUser, useCurrentChallenge, useDevice } from "../../contexts"
//@ts-ignore
import correctSong from "../../sounds/correct.mp3"
//@ts-ignore
import errorSong from "../../sounds/error.mp3"
import { createGame, getInitialStates, initTimer } from "../../utils/games"
import { currentDate } from "../../utils/helpers"
import GameNavBar from "./GameNavBar"
import QuitModal from "./GameQuitModal"
import TestInfo from "./TestInfo"

const GAME_STATES: any = {
  initialization: "initialization",
  started: "start",
  ended: "ended",
}

let savedStates: any = {}
let answers = []
let timeLastAnswer = 0
let questions = []
let questionSetType
let questionCount = 0
let time = 0
let hasQuit = false
let endOfTime = false
let triedToCheat = false
let startedAt
let timer
const audioCorrect = new Audio(correctSong)
const audioError = new Audio(errorSong)

export default () => {
  const { currentPlayer, currentChallenge, currentTeam } = useCurrentChallenge()
  const { deviceId, appVersion } = useDevice()
  const { questionSet, testMode, setAlreadyStartedGame, setSendingGame } = useContext(GameContext)
  const { userHasOrgaRole } = useAuthUser() // User is loading
  const history = useHistory()
  const location = useLocation<any>()
  const match = useRouteMatch<any>()

  const [activeQuestion, setActiveQuestion] = useState(null)
  const [correctCount, _setCorrectCount] = useState(0)
  const [currentQuestionIndex, _setCurrentQuestionIndex] = useState(0)
  const [gameState, setGameState] = useState(GAME_STATES.initialization)
  const [quitModalShown, setQuitModalShown] = useState(false)

  const warmUpInCompet = location?.state?.warmUpInCompet

  const setCurrentQuestionIndex = (index) => {
    _setCurrentQuestionIndex(index)
    saveState("currentQuestionIndex", index)
  }

  const setStartedAt = (date) => {
    saveState("startedAt", date?.toISOString())
    startedAt = date
  }

  const setQuestionSetId = (id) => {
    saveState("questionSetId", id)
  }

  const setCorrectCount = (count) => {
    _setCorrectCount(count)
    saveState("correctCount", count)
  }

  const setTimeLastAnswer = (time) => {
    timeLastAnswer = time
  }

  const setTime = (value) => {
    if (!testMode && questionSet.duration && savedStates.time < value) {
      triedToCheat = true
    }
    time = value
    saveState("time", value)
    if (triedToCheat) {
      endQuiz()
    }
  }

  const setAnswers = (value) => {
    answers = value
    saveState("answers", value)
  }

  const saveState = (state, value) => {
    if (questionSetType !== ACTIVITY_TYPES.CONTEST || testMode) return
    savedStates[state] = value
    localStorage.setItem("savedStates", JSON.stringify(savedStates))
  }

  useEffect(() => {
    if (questionSet) {
      return startGame(questionSet)
    }
  }, [questionSet])

  useEffect(() => {
    switch (gameState) {
      case GAME_STATES.started:
        handleNextQuestion(currentQuestionIndex)
        break
      case GAME_STATES.answered:
        // onAnswered()
        break
      case GAME_STATES.ended:
        endQuiz()
        break
      default:
        break
    }
  }, [gameState])

  const startGame = (questionSet) => {
    savedStates = {}
    let duration = testMode ? 0 : questionSet.duration
    endOfTime = false
    triedToCheat = false
    hasQuit = false
    if (warmUpInCompet) {
      questions = questionSet.warmUpQuestions
      questionSetType = ACTIVITY_TYPES.TRAINING
      questionCount = questionSet.warmUpQuestions.length
      duration = 0
    } else {
      questionSetType = questionSet.type
      questions = questionSet.questions
      questionCount = questionSet.questions.length
    }

    initializeStates({ id: questionSet.id, duration, startedAt: questionSet.startedAt })

    timer = new Timer()
    const clearTimer = initTimer({
      duration: duration,
      timer: timer,
      startValue: time,
      timerTargetAchieved: timerTargetAchieved,
      timerSecondsUpdated: timerSecondsUpdated,
    })

    setGameState(GAME_STATES.started)

    return () => {
      clearTimer()
    }
  }

  const initializeStates = ({ id, duration, startedAt }) => {
    const states = getInitialStates({ id, duration, startedAt })
    setAnswers(states.answers)
    setQuestionSetId(states.questionSetId)
    setStartedAt(states.startedAt)
    setCurrentQuestionIndex(states.currentQuestionIndex)
    setCorrectCount(states.correctCount)
    setTime(states.initialTime)
    setTimeLastAnswer(states.initialTime)

    if (!testMode && !(questionSetType !== ACTIVITY_TYPES.CONTEST || warmUpInCompet)) {
      setAlreadyStartedGame(true)
    }
    if (!states.isNewGame) {
      showQuitModal(true)
    }
  }

  const timerTargetAchieved = () => {
    if (!testMode) {
      endOfTime = true
      setGameState(GAME_STATES.ended)
    }
  }

  const timerSecondsUpdated = () => {
    setTime(timer.getTotalTimeValues().seconds)
    if (questionSet) {
      if (currentDate() > questionSet.endDate && !userHasOrgaRole([USER_ROLES.ADMIN])) {
        alert("Trop tard, le jeu est terminée, ta partie n'a pas pu être comptabilisée...")
        endOfTime = true
        endQuiz()
      }
    }
  }

  const endQuiz = () => {
    let quizDuration
    if (questionSet.duration === 0) {
      quizDuration = savedStates.time
    } else {
      quizDuration = questionSet.duration - savedStates.time
    }
    /*****************************/
    // const now = currentDate() TOTO CHANGE DATE FORMAT

    const gameData = createGame({
      questionSet: questionSet,
      player: currentPlayer,
      answers: answers,
      duration: quizDuration,
      phase: currentChallenge.phases.find((p) => p.id === questionSet.phase.id) || null,
      team: currentTeam,
      completedAt: currentDate(),
      correctCount: correctCount,
      challengeId: currentChallenge.id,
    })
    // gameData.publicIp = publicIp
    gameData.deviceId = deviceId
    gameData.startedAt = startedAt?.toISOString()
    gameData.appVersion = { build: process.env.REACT_APP_VERSION, version: appVersion }

    if (currentChallenge.topPlayersEnabled) {
      gameData.topPlayers = currentChallenge.topPlayers
    }
    if (endOfTime) {
      gameData.endOfTime = true
    }
    if (triedToCheat) {
      gameData.triedToCheat = true
    }
    if (hasQuit) {
      gameData.hasQuit = true
    }

    timer.stop()
    setSendingGame(gameData)

    history.push(`/${questionSet.type}s/${match.params.questionSetId}/congrats`, gameData)
  }

  const onQuit = () => {
    hasQuit = true
    endQuiz()
  }

  const handleRetry = () => {
    history.push(`/${questionSet.type}s/${questionSet.id}/intro`)
  }

  const handleValideAnswer = (answer, isCorrect) => {
    // QUESTION DURATION
    let questionDuration
    if (questionSet.duration === 0) {
      questionDuration = timer.getTotalTimeValues().seconds - timeLastAnswer
    } else {
      questionDuration = timeLastAnswer - timer.getTotalTimeValues().seconds
    }
    setTimeLastAnswer(timer.getTotalTimeValues().seconds)

    // SAVE ANSWER
    const answerData: any = {
      id: activeQuestion.id,
      isCorrect: isCorrect,
      answer: answer,
      duration: questionDuration,
    }
    if (activeQuestion.themeId) {
      answerData.themeId = activeQuestion.themeId
    }

    const newAnswers = answers
    newAnswers.push(answerData)
    setAnswers(newAnswers)

    if (isCorrect) {
      if (!(questionSetType === ACTIVITY_TYPES.CONTEST && activeQuestion.type === QUESTION_TYPES.CARD)) {
        setCorrectCount(correctCount + 1)
      }
    }

    timer.pause()

    if (questionSetType !== ACTIVITY_TYPES.TRAINING) {
      if (!isCorrect) {
        audioError.play()
      } else if (activeQuestion.type !== "card") {
        audioCorrect.play()
      }
    }
  }

  const handleNextQuestion = (nextQuestionIndex = currentQuestionIndex + 1) => {
    // INIT STATES
    if (!isGameFinished(nextQuestionIndex)) {
      setCurrentQuestionIndex(nextQuestionIndex)
      const currentQuestion = questions[nextQuestionIndex]
      if (!(questionSetType === ACTIVITY_TYPES.CONTEST && currentQuestion.type === QUESTION_TYPES.CARD)) {
        timer.start()
      }
      setActiveQuestion(currentQuestion)
    } else {
      setGameState(GAME_STATES.ended)
    }
  }

  const isGameFinished = (nextQuestionIndex) => {
    // let currentQuestionIsCorrect = isCorrect || givenIsCorrect
    // questionSetType !== ACTIVITY_TYPES.TRAINING && userHasOrgaRole([ROLES.REFEREE]) && currentQuestionIsCorrect && correctCount >= 4
    return nextQuestionIndex >= questionCount
  }

  const showQuitModal = (force = false) => {
    if (force || questionSetType === ACTIVITY_TYPES.CONTEST) {
      setQuitModalShown(true)
    } else {
      onQuit()
      // localStorage.removeItem('savedStates')
      // history.goBack()
    }
  }

  const hideQuitModal = () => {
    setQuitModalShown(false)
  }
  return activeQuestion ? (
    <IonPage>
      <TestInfo testMode={testMode} question={activeQuestion} />
      <GameNavBar
        currentQuestionIndex={currentQuestionIndex}
        duration={questionSet.duration}
        timer={timer}
        questionSetType={questionSetType}
        correctCount={correctCount}
        questionCount={questionCount}
        showQuitModal={() => showQuitModal()}
      />

      <GameQuestion
        question={activeQuestion}
        options={{
          randomizeChoices: !testMode, // && questionSetType !== ACTIVITY_TYPES.TRAINING,
          displaySolution: questionSetType !== ACTIVITY_TYPES.CONTEST,
          isLastWarmUpQuestion: currentQuestionIndex + 1 === questionCount && warmUpInCompet,
        }}
        onNextQuestion={handleNextQuestion}
        onValideAnswer={handleValideAnswer}
        onRetry={handleRetry}
      />

      <QuitModal shown={quitModalShown} cancel={hideQuitModal} correctCount={correctCount} quit={onQuit} />
    </IonPage>
  ) : (
    <Spinner />
  )
}
