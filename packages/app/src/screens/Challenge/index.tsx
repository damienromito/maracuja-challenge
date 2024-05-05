import { IonContent, IonFooter } from "@ionic/react"
import React, { useEffect } from "react"
import { useHistory } from "react-router-dom"
import { ChallengeInfo, CurrentPhaseInfo, NavBar } from "../../components"
import ROUTES from "../../constants/routes"
import { useCurrentChallenge, useCurrentOrganisation, useDevice, useNotification } from "../../contexts"
import Suggestions from "../Suggestions"
import PlayerInfo from "./PlayerInfo"

export default () => {
  const { currentChallenge, setCurrentChallengeById } = useCurrentChallenge()
  const { currentOrganisation } = useCurrentOrganisation()
  const history = useHistory()
  const notification = useNotification()
  const { platform } = useDevice()

  const onClickHelp = () => {
    history.push(ROUTES.CHALLENGE_RULES)
  }

  useEffect(() => {
    if (platform) {
      notification.requestPushPermission()
    }
  }, [platform])

  return (
    <>
      <NavBar
        title={currentOrganisation.navBarHomeTitle}
        leftAction={() => onClickHelp()}
        leftIcon="help"
        rightIcon="settings"
        rightAction={() => history.push(ROUTES.SETTINGS)}
      />

      <IonContent>
        <CurrentPhaseInfo />
        <PlayerInfo className="ion-margin" />
        <ChallengeInfo challenge={currentChallenge} />
      </IonContent>
      <IonFooter>
        <Suggestions />
      </IonFooter>
    </>
  )
}
