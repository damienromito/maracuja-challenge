import { QUESTION_TYPES } from "@maracuja/shared/constants"
import React, { useContext } from "react"
import { generatePath, useHistory, useLocation } from "react-router-dom"
import { Button, Text2, Title3, TrainingIcon } from "../../components"
import ROUTES from "../../constants/routes"
import { GameContext, useApp } from "../../contexts"
import GameIntro from "../Game/GameIntro"

export default () => {
  const { questionSet } = useContext(GameContext)
  const history = useHistory()
  const { logEvent } = useApp()
  const location = useLocation<any>()
  const keepProgression = location.state?.keepProgression

  const handleClickStartTraining = () => {
    logEvent("Start a training")
    history.push(generatePath(ROUTES.TRAINING_PLAY, { questionSetId: questionSet.id }), { keepProgression })
  }

  const memoCardCount = questionSet.questions.reduce(
    (prev, current) => (current.type === QUESTION_TYPES.CARD ? prev + 1 : prev),
    0
  )
  return (
    <GameIntro
      title="Entrainement"
      description={questionSet.description || "Entraine-toi pour te préparer aux épreuves à venir ! 😉"}
      header={
        <>
          <TrainingIcon progression={questionSet._stats?.progression} large />
          <Title3 style={{ marginTop: 5 }}>{questionSet.name}</Title3>
          <Text2>Entrainé à {questionSet.getProgression(true)}</Text2>
        </>
      }
      questionsInfos={`${questionSet.questions.length - memoCardCount} questions 
        ${memoCardCount ? `et ${memoCardCount} cartes mémo ` : ""} 
        ${keepProgression ? "restantes" : ""}`}
      footer={
        <>
          <Button onClick={handleClickStartTraining}>S'entrainer</Button>
        </>
      }
    />
  )
}
