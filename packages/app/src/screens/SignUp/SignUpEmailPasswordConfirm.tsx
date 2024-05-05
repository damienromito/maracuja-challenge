import { IonContent, IonPage } from '@ionic/react'
import { useCurrentChallenge } from '@maracuja/shared/contexts'
import React from 'react'
import styled from 'styled-components'
import { Button, Container, NavBar, Title1 } from '../../components'
import ROUTES from '../../constants/routes'
import { checkPlayerHasRequiredChallengeInfo } from '../../utils/helpers'

const PageContainer = styled(Container)` 
`

export default ({ history, location }) => {
  const { currentPlayer, currentChallenge } = useCurrentChallenge()

  const handleClickOk = () => {
    if (!currentPlayer) {
      alert('Connecte-toi sur l\'application pour rejoindre le challenge')
      history.push(ROUTES.HOME)
    } else {
      if (!checkPlayerHasRequiredChallengeInfo(currentPlayer, currentChallenge)) {
        history.push(ROUTES.SIGN_UP__INFO)
      } else {
        history.push(ROUTES.ONBOARDING_WELCOME)
      }
    }
  }
  return (
    <IonPage>

      <NavBar title='Inscription' />
      <IonContent>
        <PageContainer>
          <br /><br />
          <Title1>Ton e-mail a été validé !</Title1>
          <br /><br />
          <Button onClick={handleClickOk}>Continuer</Button>
        </PageContainer>
      </IonContent>
    </IonPage>

  )
}
