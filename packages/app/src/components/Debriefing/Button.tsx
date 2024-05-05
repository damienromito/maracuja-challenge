import { Button } from "@maracuja/shared/components"
import { QuestionSet } from "@maracuja/shared/models"
import React from "react"
import { generatePath, useHistory } from "react-router-dom"
import { ROUTES } from "../../constants"

interface DebriefingButtonProps {
  contestToDebrief: QuestionSet
}
export default ({ contestToDebrief }: DebriefingButtonProps) => {
  const history = useHistory()

  const handleClick = ({ keepProgression }) => {
    history.push(generatePath(ROUTES.DEBRIEFING_INTRO, { questionSetId: contestToDebrief.id }), { keepProgression })
  }

  return (
    <>
      {contestToDebrief.getDebriefingProgression() === 1 ? (
        <Button secondary onClick={handleClick}>
          Débriefer à nouveau
        </Button>
      ) : contestToDebrief.getDebriefingProgression() > 0 ? (
        <>
          <Button style={{ marginBottom: 8 }} onClick={() => handleClick({ keepProgression: true })}>
            Continuer le debriefing
          </Button>
          <Button secondary onClick={handleClick}>
            Refaire le débriefing
          </Button>
        </>
      ) : (
        <Button onClick={handleClick}>Débriefer</Button>
      )}
    </>
  )
}
