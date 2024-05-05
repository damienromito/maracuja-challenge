import { Button } from "@maracuja/shared/components"
import React from "react"
import { generatePath, useHistory } from "react-router-dom"
import { ROUTES } from "../../constants"

interface TrainingButtonProps {
  training?: any
}
export default ({ training }: TrainingButtonProps) => {
  const history = useHistory()

  const handleClick = ({ keepProgression }) => {
    history.push(generatePath(ROUTES.TRAINING_INTRO, { questionSetId: training.id }), { keepProgression })
  }

  return (
    <>
      {training.getProgression() > 0 && training.getProgression() < 1 && (
        <Button style={{ marginBottom: 8 }} onClick={() => handleClick({ keepProgression: true })}>
          Continuer l'entrainement
        </Button>
      )}
      {training.hasPlayed ? (
        <Button secondary onClick={handleClick}>
          Refaire l'entrainement
        </Button>
      ) : (
        <Button onClick={handleClick}>S'entrainer</Button>
      )}
    </>
  )
}
