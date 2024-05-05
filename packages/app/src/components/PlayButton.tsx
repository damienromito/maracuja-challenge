import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useApp, useAuthUser, useCurrentChallenge } from "../contexts"
import { currentDate } from "../utils/helpers"
import { Button, SpectatorButton, Text2 } from "./"
import { ACTIVITY_TYPES, USER_ROLES } from "@maracuja/shared/constants"

let countDown = null
let countDownInterval

const PlayButton = ({
  questionSet,
  analyticsId = "",
  withoutIntro = false,
  hasCountDown = false,
  title = undefined,
}) => {
  const { currentRanking } = useCurrentChallenge()
  const { userHasOrgaRole, authUser } = useAuthUser()
  const { logEvent } = useApp()
  const history = useHistory()
  const [titleButton, setTitleButton] = useState<any>(title)
  const dataToSendGame = localStorage.getItem("dataToSendGame")
    ? JSON.parse(localStorage.getItem("dataToSendGame"))
    : false

  const onClickPlay = () => {
    if (hasCountDown) {
      if (countDown === null) {
        countDown = 3
        setTitleButton(countDown)
        countDown--
        countDownInterval = setInterval(countDownCallback, 1000)
      } else {
        clearInterval(countDownInterval)
        setTitleButton(title)
        countDown = null
      }
    } else {
      countDown = null
      startGame()
    }
  }

  const countDownCallback = () => {
    if (countDown > 0) {
      setTitleButton(countDown)
    } else if (countDown === 0) {
      clearInterval(countDownInterval)
      startGame()
    }
    countDown--
  }

  const startGame = () => {
    const nowDate = currentDate()

    if (userHasOrgaRole([USER_ROLES.ADMIN]) || nowDate < questionSet.endDate) {
      if (!userHasOrgaRole([USER_ROLES.ADMIN]) && nowDate < questionSet.startDate) {
        logEvent("game_exit", { label: "too early" })

        alert("Trop tôt, le jeu commence bientôt ! 🤗 ")
        setTitleButton(title)
      } else if (withoutIntro) {
        logEvent("game_start")
        history.push(`/${questionSet.type}s/${questionSet.id}/play`)
      } else {
        // const questionSetData = objectSubset(questionSet, ['id', 'type'])
        history.push(`/${questionSet.type}s/${questionSet.id}/intro`, { questionSet })
        logEvent("game_intro", { label: analyticsId })
      }
    } else {
      alert("Trop tard, le jeu est terminée ! 😕 ")
      setTitleButton(title)
    }
  }
  useEffect(() => {
    const savedStates = localStorage.getItem("savedStates")

    if (savedStates && JSON.parse(savedStates).questionSetId === questionSet.id) {
      setTitleButton("Terminer le quiz")
    } else if (!titleButton) {
      if (questionSet.type === ACTIVITY_TYPES.TRAINING) {
        setTitleButton("S'entrainer")
      } else if (questionSet.type === ACTIVITY_TYPES.CONTEST) {
        setTitleButton("Jouer")
      } else if (questionSet.type === ACTIVITY_TYPES.ICEBREAKER) {
        setTitleButton("Jouer")
      }
    }
  }, [])

  const ButtonAspect = () => {
    if (
      currentRanking?.currentTeamSelected ||
      authUser.hasRole(USER_ROLES.SUPER_ADMIN) ||
      questionSet.type === ACTIVITY_TYPES.TRAINING
    ) {
      if (questionSet.type === ACTIVITY_TYPES.TRAINING) {
        if (questionSet.hasPlayed) {
          return (
            <Button data-test="button-train-again" onClick={() => onClickPlay()} secondary>
              {" "}
              {titleButton} à nouveau
            </Button>
          )
        } else
          return (
            <Button data-test="button-train" onClick={() => onClickPlay()}>
              {" "}
              {titleButton}
            </Button>
          )
      } else {
        if (!questionSet.hasPlayed) {
          return (
            <Button data-test="button-play" onClick={() => onClickPlay()}>
              {" "}
              {titleButton}
            </Button>
          )
        } else {
          return <Text2 center> Tu as déjà participé !</Text2>
        }
      }
    } else if (currentRanking) {
      return <SpectatorButton style={{ display: "inline-block", background: "white" }} />
    } else {
      return null
    }
  }

  if (dataToSendGame) {
    return (
      <>
        <Text2 center>⚠️ Ta partie n'as pas été enregistrée</Text2>
        <Button onClick={() => history.push(`/${questionSet.type}/${dataToSendGame.questionSet.id}/congrats`)}>
          Réessayer
        </Button>
      </>
    )
  } else {
    return <ButtonAspect />
  }
}

export default PlayButton
