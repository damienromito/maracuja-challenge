import { IonContent, IonPage } from '@ionic/react'
import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Container, FullScreenContainer, RegularLink, ShareButton, Spinner, Text2, Title1, Title3 } from '../../components'
import ROUTES from '../../constants/routes'
import { useApp, useCurrentChallenge } from '../../contexts'
import captainImage from '../../images/captain.svg'

export default () => {
  const history = useHistory()
  const { logEvent } = useApp()

  const { currentChallenge, currentPlayer } = useCurrentChallenge()

  const handleSkipStep = () => {
    logEvent('onboarding_need_captain_skip')
    handleNextScreen()
  }

  const handleNextScreen = () => {
    if (currentChallenge.playersAvatarInOnboarding && !currentPlayer.avatar) {
      history.push(ROUTES.SIGN_UP__ONBOARDING_PLAYERCARD)
    } else {
      history.push(ROUTES.HOME)
    }
  }

  return !currentPlayer
    ? <Spinner />
    : (
      <IonPage>
        <IonContent>
          <WelcomeContainer>
            <Container>
              <Title1>{currentChallenge.wording.yourTribe} a besoin d’un {currentChallenge.wording.captain} !</Title1>
            </Container>

            <Container centering>
              <img style={{ flex: 1 }} src={captainImage} />
              <br />
            </Container>
            <InfoBlock>
              <Title3>Il n’y a pas de {currentChallenge.wording.captain} dans ton {currentChallenge.wording.yourTribe} !</Title3>
              <Text2>Ton {currentChallenge.wording.yourTribe} pourra participer au challenge lorsqu’au moins {currentChallenge.wording.captain} sera inscrit. </Text2>
            </InfoBlock>

            <Container>
              <ShareButton contentType='captain'>INVITER TON {currentChallenge.wording.captain}</ShareButton>
              <RegularLink onClick={handleSkipStep}>Passer </RegularLink>

            </Container>

          </WelcomeContainer>
        </IonContent>
      </IonPage>
      )
}

const WelcomeContainer = styled(FullScreenContainer)`
  justify-content: space-around;
  .club-avatar {
    width : 25vh;
    height : 25vh;
    align-self: center;
  }
`
const InfoBlock = styled.div`
  background : ${props => props.theme.bg.info};
  width: 100%;
  padding: 16px;
  color: black;
`
