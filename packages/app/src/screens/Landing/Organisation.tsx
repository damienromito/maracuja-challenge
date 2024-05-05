import { IonContent, IonPage } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import 'swiper/css/swiper.css'
import {
  ChallengesSlider,
  CodeChallengeForm,
  Container,
  FullScreenContainer,
  LandingLogo,
  LogoMaracuja,
  NavBar, PartnersFooter, RegularLink, Text4
} from '../../components'
import ROUTES from '../../constants/routes'
import { useAuthUser, useCurrentOrganisation, useDevice } from '../../contexts'

export default () => {
  const { authUser } = useAuthUser()
  const { currentOrganisation, setCurrentOrganisationById } = useCurrentOrganisation()
  const { appOrganisationId } = useDevice()
  const [displayCodeForm, setDisplayCodeForm] = useState(false)
  const [orgaChallenges, setOrgaChallenges] = useState(null)

  const history = useHistory()

  useEffect(() => {
    setOrgaChallenges(currentOrganisation.challenges)
  }, [])

  const handleExitOrganisation = () => {
    setCurrentOrganisationById(null)
  }

  return (
    <IonPage>
      {authUser &&
        <NavBar
          title={`Hello ${authUser.username + ' ' || ''}!`}
          rightIcon='settings' rightAction={() => history.push(ROUTES.SETTINGS)}
        />}
      <IonContent>
        <PageContainer style={{ height: displayCodeForm ? 'auto' : (authUser ? 'calc( 100vh - 64px )' : '100vh') }}>
          <div> </div>
          <LandingLogo className='landing-logo' />
          {orgaChallenges &&
            <ChallengesSlider challenges={orgaChallenges} />}
          <br />

          {displayCodeForm
            ? <CodeChallengeForm />
            : <RegularLink data-test='button-show-input-code' onClick={setDisplayCodeForm}>Rejoindre un challenge privé</RegularLink>}

          {appOrganisationId && (
            <OrganisationFooter>
              {currentOrganisation.welcomeMessage &&
                <Text4 className='welcomeMessage'> {currentOrganisation.welcomeMessage}</Text4>}
              <div>
                <span>Propulsé par</span>
                <LogoMaracuja />
              </div>
            </OrganisationFooter>
          )}

          {!appOrganisationId &&
          (
            <Container>
              <RegularLink inline onClick={handleExitOrganisation}>Quitter les challenges {currentOrganisation.name}</RegularLink>
            </Container>)}

          {currentOrganisation.partners
            ? <PartnersFooter partners={currentOrganisation.partners} />
            : <div> </div>}

        </PageContainer>
      </IonContent>
    </IonPage>
  )
}
const PageContainer = styled(FullScreenContainer)`
  justify-content: space-between;
  text-align : center;
  @media (max-height: 670px){
    .welcomeMessage{
      display:none
    }
  }
  @media (max-height: 600px){
    .landing-logo{
      display:none
    }
  }
  
 

`
const OrganisationFooter = styled(Container)`
  text-align:center;
  max-width: 400px;
  margin : 0 auto;
  span{
    font-size: 12px;
    position: relative;
    font-family: 'Chelsea Market';
    top: -12px;
    margin-right: 5px
  }
  .logo-maracuja{
    width: 100px;
    margin-top: 10px;
  }
`
