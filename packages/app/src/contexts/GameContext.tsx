import { ACTIVITY_TYPES, USER_ROLES } from "@maracuja/shared/constants"
import { useAuthUser } from "@maracuja/shared/contexts"
import { QuestionSet } from "@maracuja/shared/models"
import { StartDebfriefingProps } from "@maracuja/shared/models/QuestionSet"
import React, { createContext, useEffect, useState } from "react"
import { useHistory, useLocation, useRouteMatch } from "react-router-dom"
import styled from "styled-components"
import { ROUTES } from "../constants"
import { useApp, useCurrentChallenge } from "./"
import { useDevice } from "./DeviceContext"

const GameContext = createContext<any>(undefined)

const GameContextProvider = (props) => {
  const { openPopup, setLoading, openAlert } = useApp()
  const { deviceId } = useDevice()
  const { currentChallenge, currentPlayer, currentQuestionSets } = useCurrentChallenge()
  const { authUser } = useAuthUser()
  const history = useHistory()
  const match: any = useRouteMatch<any>()
  const location: any = useLocation<any>()

  const [questionSet, setQuestionSet] = useState<any>(null)
  const [testMode, setTestMode] = useState<any>(false)
  const [alreadyStartedGame, setAlreadyStartedGame] = useState<any>(false)
  const [sendingGame, _setSendingGame] = useState<any>(null)
  const [disableSendingGame, setDisableSendingGame] = useState<any>(false)

  const setSendingGame = (gameData: any) => {
    localStorage.setItem("dataToSendGame", JSON.stringify(gameData))
    _setSendingGame(gameData)
  }

  const removeSendingGame = () => {
    localStorage.removeItem("dataToSendGame")
    _setSendingGame(null)
  }

  useEffect(() => {
    if (!questionSet) {
      if (localStorage.getItem("testMode") === "true") {
        if (authUser.hasRole(USER_ROLES.ADMIN)) {
          initTestMode()
        } else {
          removeTestMode()
        }
      }
      init()
    }
  }, [questionSet])

  const removeTestMode = () => {
    localStorage.removeItem("testMode")
    setDisableSendingGame(false)
    setTestMode(false)
  }

  const addTestMode = () => {
    localStorage.setItem("testMode", "true")
    initTestMode()
  }

  const initTestMode = () => {
    setTestMode(true)
    localStorage.removeItem("dataToSendGame")
    localStorage.removeItem("savedStates")
    setDisableSendingGame(true)
  }

  const init = async () => {
    console.log("******init GAME:")

    setLoading("Chargement de la partie...")

    initSendingGame()

    const params: StartDebfriefingProps = {
      challengeId: currentChallenge.id,
      questionSetId: match.params.questionSetId,
      playerId: currentPlayer.id,
      testMode: localStorage.getItem("testMode") === "true",
      keepProgression: location?.state?.keepProgression,
    }
    let response

    try {
      switch (match.path) {
        case ROUTES.CONTEST:
          params.deviceId = deviceId
          response = await QuestionSet.startContest(params)
          break
        case ROUTES.ICEBREAKER:
          response = await QuestionSet.startIcebreaker(params)
          break
        case ROUTES.TRAINING:
          response = await QuestionSet.startTraining(params)
          if (response.questionSet) {
            const currentQuestionSet = currentQuestionSets.find((q) => q.id === match.params.questionSetId)
            Object.assign(response.questionSet, currentQuestionSet)
          }
          break
        case ROUTES.DEBRIEFING:
          params.contestId = match.params.questionSetId
          response = await QuestionSet.startDebfriefing(params)
          break
        default:
          alert("Error")
          break
      }
    } catch (error) {
      console.log("error:", error)
      setLoading(false)
      history.goBack()
      return
    }

    console.log("response:", response)
    const error = response.error
    if (error) {
      console.log("error:", error)
      if (error.code === "anti-cheat/advertisement") {
        openAlert({ message: error.message, title: error.title })
      } else {
        const isAdmin = authUser.hasRole(USER_ROLES.ADMIN)
        const popupContent = {
          message: error.message,
          buttonText: isAdmin ? "Acceder en tant que testeur" : "ok",
          callback: () => {
            if (isAdmin) {
              addTestMode()
              init()
            } else history.goBack()
          },
        }
        openPopup(popupContent)
      }
    }

    if (response.questionSet) {
      const qs = response.questionSet
      const phase = currentChallenge.phases?.find((p) => p.id === qs.phase.id)
      qs.phase = phase
      setQuestionSet(qs)
    }
    setLoading(false)
  }

  const initSendingGame = () => {
    const sendingData = localStorage.getItem("dataToSendGame")
    if (sendingData) {
      const sendingGameData = JSON.parse(localStorage.getItem("dataToSendGame"))
      setSendingGame(sendingGameData)
    }
  }

  const reset = () => {
    setQuestionSet(null)
    console.log("RESET")
  }
  return questionSet ? (
    <GameContext.Provider
      value={{
        questionSet,
        init,
        reset,
        testMode,
        addTestMode,
        removeTestMode,
        disableSendingGame,
        setAlreadyStartedGame,
        setDisableSendingGame,
        alreadyStartedGame,
        setSendingGame,
        sendingGame,
        removeSendingGame,
      }}
    >
      {testMode && <TestInfo>TESTMODE</TestInfo>}
      {props.children}
    </GameContext.Provider>
  ) : null
}
const TestInfo = styled.div`
  color: red;
  position: fixed;
  width: 100%;
  z-index: 12;
  text-align: right;
`
export { GameContext, GameContextProvider }
