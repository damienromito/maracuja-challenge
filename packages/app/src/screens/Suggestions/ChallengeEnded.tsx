import React from "react"
import { useHistory } from "react-router-dom"
import { Button, RegularLink, TitleDate } from "../../components"
import ROUTES from "../../constants/routes"
import { useCurrentChallenge } from "../../contexts"
import Container from "./SuggestionContainer"

export default () => {
  const { setCurrentChallengeById, currentChallenge } = useCurrentChallenge()
  const history = useHistory()

  const onClickExit = () => {
    if (window.confirm("Quitter ce challenge ?") === true) {
      setCurrentChallengeById(null)
      history.push(ROUTES.HOME)
    }
  }

  const oneWeekAfterTheEnd = new Date(currentChallenge.endDate)
  oneWeekAfterTheEnd.setDate(oneWeekAfterTheEnd.getDate() + 1 * 7)
  const now = new Date()

  return (
    <Container title="Le challenge est terminé">
      {/* {now > oneWeekAfterTheEnd ? (
        <Button onClick={onClickExit}>Changer de challenge</Button>
      ) : ( */}
      <>
        <Button onClick={() => history.push(ROUTES.ACTIVE_RANKING)}>Voir le classement</Button>
        <RegularLink onClick={onClickExit}>Rejoindre un autre challenge</RegularLink>
      </>
      {/* )} */}
    </Container>
  )
}
