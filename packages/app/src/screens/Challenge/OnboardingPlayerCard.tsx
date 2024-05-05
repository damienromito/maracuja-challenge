import { IonContent, IonPage } from "@ionic/react"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import React, { useState } from "react"
import PlayerCardViewer from "../../components/PlayerCardViewer"
import PlayerCardOnboarding from "../../components/PlayerCardViewer/style/PlayerCardOnboarding"
import {
  RegularLink,
  RadialContainer,
  Button,
  Title1,
  Container,
} from "../../components"
import { useApp } from "../../contexts"
import { useHistory } from "react-router-dom"
import { ROUTES } from "../../constants"

export default () => {
  const { currentPlayer, currentTeam } = useCurrentChallenge()

  const [showCardPreview, setShowCardPreview] = useState(null)
  const history = useHistory()
  const { logEvent } = useApp()
  const onClickFinaliseCard = () => {
    history.push(`${ROUTES.EDIT_CURRENT_PLAYER}/photo`)
    logEvent("onboarding_player_card_start")
  }

  return (
    <>
      <IonPage>
        <IonContent>
          <RadialContainer />
          <PlayerCardOnboarding>
            <Container>
              <Title1>
                Finalise ta carte joueur pour représenter l’équipe !
              </Title1>
            </Container>
            <Container>
              <div style={{ height: "250px" }}>
                <div className="player-card__content">
                  <PlayerCardViewer
                    onboardingPlayerCard
                    onClickPopupButton={() => {
                      setShowCardPreview(false)
                    }}
                    player={currentPlayer}
                    team={currentTeam}
                  />
                </div>
              </div>
            </Container>
            <Container style={{ width: "100%" }}>
              <Button onClick={() => onClickFinaliseCard()}>
                Compléter ma carte joueur
              </Button>
              <RegularLink
                onClick={() => {
                  logEvent("onboarding_player_card_skip")
                  history.push(ROUTES.HOME)
                }}
              >
                Passer{" "}
              </RegularLink>
            </Container>
          </PlayerCardOnboarding>
        </IonContent>
      </IonPage>
    </>
  )
}
