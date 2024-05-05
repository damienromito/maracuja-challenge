import React from "react"
import { useHistory } from "react-router-dom"
import { Button, CountDown, RegularLink, TitleDate } from "../../components"
import ROUTES from "../../constants/routes"
import { useCurrentChallenge } from "../../contexts"
import Suggestion from "./Suggestion"
import Container from "./SuggestionContainer"

export default () => {
  const { setCurrentChallengeById, currentChallenge } = useCurrentChallenge()

  const nextPhase = currentChallenge.getNextPhase()

  return (
    <Suggestion>
      <Container title="La prochaine phase commence dans">
        <CountDown date={nextPhase.startDate} />
      </Container>
    </Suggestion>
  )
}
