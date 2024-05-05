import React from "react"
import { generatePath, useHistory } from "react-router-dom"
import { Button } from "../../components"
import ROUTES from "../../constants/routes"
import { useCurrentChallenge } from "../../contexts"

export default () => {
  const { currentTeam, currentPlayer, currentPhase } = useCurrentChallenge()
  if (!currentPhase) return null

  const history = useHistory()

  const handleClickDiscoverTeam = ({ keepProgression }) => {
    history.push(`/icebreakers/${currentTeam.icebreaker?.questionSetId}/intro`, { keepProgression })
  }

  const handleClickCreateQuestion = () => {
    history.push(generatePath(ROUTES.ICEBREAKER_CREATE_QUESTION))
  }

  if (currentTeam.icebreaker?.questionCount) {
    const newQuestionCount = currentTeam.icebreaker?.questionCount - (currentPlayer.icebreaker?.lastQuestionCount || 0)
    const icebreakerProgression = currentPlayer.icebreaker?.progression
    let progressionString = ""
    if (newQuestionCount) {
      progressionString = `(+${newQuestionCount})`
    } else if (icebreakerProgression < 1.0) {
      progressionString = `(${Math.round((currentPlayer.icebreaker?.progression || 0) * 100) + "%"})`
    } else {
      progressionString = "✓"
    }
    //
    return !newQuestionCount &&
      (icebreakerProgression === 1.0 || (!icebreakerProgression && icebreakerProgression != 0)) ? (
      <Button secondary onClick={handleClickDiscoverTeam}>
        Redécouvrir tes coéquipiers
      </Button>
    ) : (
      <Button
        onClick={() =>
          handleClickDiscoverTeam({
            keepProgression: (newQuestionCount === 0 && !!currentPlayer.icebreaker?.gameCount) || false,
          })
        }
      >
        Découvrir tes coéquipiers {progressionString}
      </Button>
    )
  } else {
    return <Button onClick={handleClickCreateQuestion}>Qui te connait ?</Button>
  }
}
