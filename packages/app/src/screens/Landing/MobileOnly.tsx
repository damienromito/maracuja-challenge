import { IonContent, IonPage } from '@ionic/react'
import { useCurrentChallenge, useCurrentOrganisation } from '@maracuja/shared/contexts'
import React from 'react'
import { HelpLink, LandingLogo, ChallengeInfo, Title1, RegularLink } from '../../components'

export default () => {
  const { currentChallenge, setCurrentChallengeById } = useCurrentChallenge()
  const { currentOrganisation } = useCurrentOrganisation()

  const androidUrl = currentOrganisation?.storesUrls?.web?.android || process.env.REACT_APP_ANDROID_URL_WEB
  const iosUrl = currentOrganisation?.storesUrls?.web?.ios || process.env.REACT_APP_IOS_URL_WEB

  return (
    <IonPage>
      <IonContent style={{ textAlign: 'center' }}>
        <br /><br />
        {currentChallenge
          ? <ChallengeInfo challenge={currentChallenge} large />
          : <LandingLogo />}
        <br /><br />
        <Title1>Ouvre ce lien sur ton téléphone. </Title1>
        {currentChallenge &&
          (
            <>
              <RegularLink onClick={() => setCurrentChallengeById(null)}>Revenir à l'accueil</RegularLink>
              <br /><br />
            </>
          )}
        <p>ou télécharge l'application :</p>

        <br />
        <div>
          <a style={{ textDecoration: 'underline' }} href={androidUrl} target='_blank' rel='noreferrer'>Sur le Google Play Store</a><br /><br />
          <a style={{ textDecoration: 'underline' }} href={iosUrl} target='_blank' rel='noreferrer'>Sur l'App Store</a>
        </div>
        <br /><br />
        <HelpLink label='web-landing' />
        <br /><br />
      </IonContent>
    </IonPage>
  )
}
