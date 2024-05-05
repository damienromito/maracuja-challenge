import React from "react"
import { useHistory } from "react-router-dom"
import { Button, RegularLink, TitleDate } from "../../components"
import ROUTES from "../../constants/routes"
import { useCurrentChallenge } from "../../contexts"
import Container from "./SuggestionContainer"
import { ChallengePreview } from "@maracuja/shared/models/Challenge"
import Suggestion from "./Suggestion"

export default () => {
  const { setCurrentChallengeById, currentChallenge } = useCurrentChallenge()
  const history = useHistory()
  const nextChallenge: ChallengePreview = currentChallenge.nextChallenge
  const onClickJoin = () => {
    setCurrentChallengeById(nextChallenge.id)
    history.push(ROUTES.SIGN_UP__WHITE_LIST)
  }

  return (
    <Suggestion>
      <Container title={nextChallenge.name}>
        <Button onClick={onClickJoin}>Rejoindre le challenge</Button>
        {nextChallenge.startDate < new Date() && <p>EN COURS...</p>}
      </Container>
    </Suggestion>
  )
}
