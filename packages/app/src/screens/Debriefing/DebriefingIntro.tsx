import React, { useContext } from "react"
import { generatePath, useHistory, useLocation } from "react-router-dom"
import { Button, DebriefingIcon, Title3 } from "../../components"
import ROUTES from "../../constants/routes"
import { GameContext } from "../../contexts"
import GameIntro from "../Game/GameIntro"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import Text2 from "../../components/Text2"

export default () => {
  const { questionSet } = useContext(GameContext)
  const { currentQuestionSets } = useCurrentChallenge()

  const history = useHistory()
  const constestToDebrief = currentQuestionSets.find((qs) => qs.id === questionSet.id)

  const location = useLocation<any>()
  const keepProgression = location.state?.keepProgression

  const handleClickStartDebriefing = () => {
    history.push(generatePath(ROUTES.DEBRIEFING_PLAY, { questionSetId: questionSet.id }), { keepProgression })
  }

  const unAnsweredQuestionCount =
    constestToDebrief._stats.questionCount - constestToDebrief._stats.score - constestToDebrief._stats.errorCount
  return (
    <GameIntro
      title="Debriefing"
      description={questionSet.description}
      header={
        <>
          <DebriefingIcon progression={constestToDebrief.getDebriefingProgression()} large />
          <Title3 style={{ marginTop: 5 }}>{questionSet.name}</Title3>
          <Text2>Debriefé à {constestToDebrief.getDebriefingProgression(true)}</Text2>
        </>
      }
      questionsInfos={
        <>
          {questionSet.questions.length} question(s) {keepProgression ? "restantes " : ""} à débriefer
          {!keepProgression && unAnsweredQuestionCount > 0 && (
            <>
              <br />
              <span className="text-tertiary">
                {constestToDebrief._stats.errorCount} erreur(s) et {unAnsweredQuestionCount} question(s) non répondue(s)
              </span>
            </>
          )}
        </>
      }
      footer={<Button onClick={handleClickStartDebriefing}>Débriefer</Button>}
    />
  )
}
