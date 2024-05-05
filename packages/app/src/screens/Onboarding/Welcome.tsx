import { IonContent, IonPage } from "@ionic/react"
import { ClubAvatar } from "@maracuja/shared/components"
import { PLAYER_ROLES } from "@maracuja/shared/constants"
import React from "react"
import { useHistory } from "react-router-dom"
import styled from "styled-components"
import { Button, Container, RadialContainer, Spinner, Title1, Title3 } from "../../components"
import ROUTES from "../../constants/routes"
import { useCurrentChallenge } from "../../contexts"

const WelcomeContainer = styled(RadialContainer)`
  justify-content: space-around;
  .club-avatar {
    width: 25vh;
    height: 25vh;
    align-self: center;
  }
`

const Welcome = () => {
  const history = useHistory()

  const { currentChallenge, currentPlayer, currentTeam, currentPhase } = useCurrentChallenge()

  const handleSignUp = () => {
    if (
      !currentPlayer.hasRole(PLAYER_ROLES.REFEREE) &&
      (!currentTeam.captainCount || currentTeam.captainCount === 0) &&
      currentChallenge.onboarding?.needCaptain
    ) {
      history.push(ROUTES.ONBOARDING_NEED_CAPTAIN)
    } else if (currentChallenge.playersAvatarInOnboarding && !currentPlayer.avatar) {
      history.push(ROUTES.SIGN_UP__ONBOARDING_PLAYERCARD)
    } else {
      history.push(ROUTES.HOME)
    }
  }

  const handleCreateTeam = () => {
    history.push(ROUTES.EDIT_ACTIVE_CLUB)
  }

  return !currentPlayer ? (
    <Spinner />
  ) : (
    <IonPage>
      <IonContent>
        <WelcomeContainer>
          <Container>
            <Title1>
              Bienvenue <br />
              {currentPlayer.username} !
            </Title1>
          </Container>

          <Container centering>
            <ClubAvatar logo={currentTeam.logo?.getUrl("400")} size={200} />
            <br />

            {currentTeam.hasDefautName() ? (
              <Title3>Tu peux commencer à paramétrer ton équipe</Title3>
            ) : (
              <Title3>
                Tu viens de rejoindre {currentChallenge.wording.theTribe}
                <br />
                {currentTeam.name}
              </Title3>
            )}
          </Container>

          <Container>
            {currentPhase && currentTeam.hasDefautName() ? (
              <Button onClick={() => handleCreateTeam()} data-test="button-join">
                Créer ton équipe
              </Button>
            ) : (
              <Button onClick={() => handleSignUp()} data-test="button-join">
                Rejoindre {currentChallenge.wording.theTribe}
              </Button>
            )}
          </Container>
        </WelcomeContainer>
      </IonContent>
    </IonPage>
  )
}

export default Welcome
