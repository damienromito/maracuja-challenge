import { IonContent, IonPage } from '@ionic/react'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import {
  Button, ChallengeInfo, Container, FullScreenContainer, LandingLogo, NavBar, PartnersFooter, Text2
} from '../../components'
import ROUTES from '../../constants/routes'
import { useApp, useAuthUser, useCurrentChallenge } from '../../contexts'
import JoinChallengePopup from './JoinChallengePopup'

export default () => {
  const { openAlert } = useApp()
  const { currentChallenge, setCurrentChallengeById, currentPhase } = useCurrentChallenge()
  const { authUser } = useAuthUser()

  const [openJoinPopup, setOpenJoinPopup] = useState(false)
  const history = useHistory()
  const handleChangeChallenge = () => {
    openAlert({
      title: 'Quitter le challenge ?',
      message: 'Quitter le challenge ?',
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        { text: 'OK', handler: () => setCurrentChallengeById(null) }
      ]
    })
  }

  return (
    <IonPage>
      {authUser &&
        <NavBar title={`Hello ${authUser.username + ' ' || ''}!`} rightIcon='settings' rightAction={() => history.push(ROUTES.SETTINGS)} />}
      <IonContent>
        <ChallengeContainer className={`${!authUser ? 'signout' : ''}`}>
          <div> </div>
          <LandingLogo />

          <ChallengeInfo challenge={currentChallenge} large />
          {currentChallenge.description &&
            <Container><Text2>{currentChallenge.description}</Text2></Container>}
          <Container>
            {currentPhase?.signupDisabled &&
              <p>🚫 Inscriptions fermées ({currentPhase.name} en cours)</p>}
            <Button data-test='button-join' onClick={() => setOpenJoinPopup(true)} className='ion-margin-vertical'>Rejoindre le challenge</Button>
            <LoginLink onClick={handleChangeChallenge}>Changer de challenge</LoginLink>
          </Container>

          {/* {popupSignUpOpened &&
            <SignUpPickerPopup open={popupSignUpOpened} onClose={() => setPopupSignUpOpened(false)} closeButton />} */}

          <JoinChallengePopup isOpen={openJoinPopup} onClose={() => setOpenJoinPopup(false)} />

          {currentChallenge.partners
            ? <PartnersFooter partners={currentChallenge.partners} />
            : <div> </div>}

        </ChallengeContainer>
      </IonContent>
    </IonPage>
  )
}

const ChallengeContainer = styled(FullScreenContainer)`
  justify-content: space-between;
  .navbar{margin-bottom: 20px}
  &.signout{
    padding-top: 35px;
  }
  &:before{
    background : ${props => props.theme.bg.secondary};
    width: 100%;
    /* height: calc(vh - 400px); */
  }
  .title-date{color : ${props => props.theme.text.tertiary}}
  h2.challenge-title{margin: 10px 0 2px 0;}
`

const LoginLink = styled.a`
  text-decoration : underline;
  padding-top: 5px;
  display: inline-block;
`
