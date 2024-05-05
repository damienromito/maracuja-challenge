import { IonContent, IonPage } from "@ionic/react"
import React from "react"
import { Container, NavBar, Text3 } from "../../components"
import { useAuthUser, useCurrentChallenge } from "../../contexts"

const Settings = ({ history }) => {
  const { onSignOut, authUser } = useAuthUser()
  const { currentPlayer, setCurrentChallengeById, currentChallenge, currentTeam } = useCurrentChallenge()

  return (
    authUser && (
      <IonPage>
        <NavBar title="Notifications" leftAction={() => history.goBack()} leftIcon="back" />
        <IonContent>
          <Container>
            <Text3 style={{ marginBottom: 10 }}>Tu es inscrit avec {authUser.phoneNumber || authUser.email}</Text3>
          </Container>
        </IonContent>
      </IonPage>
    )
  )
}

export default Settings
