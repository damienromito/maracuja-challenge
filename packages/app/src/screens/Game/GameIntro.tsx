import { IonContent, IonPage } from "@ionic/react"
import { USER_ROLES } from "@maracuja/shared/constants"
import React, { useContext, useEffect } from "react"
import { useHistory } from "react-router-dom"
import styled from "styled-components"
import { Container, FullScreenContainer, NavBar, RegularLink, Text2 } from "../../components"
import { GameContext, useAuthUser, useCurrentChallenge } from "../../contexts"
import Text1 from "../../components/Text1"
import { ROUTES } from "../../constants"

export default ({ children = null, title, questionsInfos, footer, header, description }) => {
  const { authUser } = useAuthUser()
  const { currentChallenge } = useCurrentChallenge()
  const { questionSet, alreadyStartedGame, removeTestMode, addTestMode, testMode } = useContext(GameContext)
  const history = useHistory()

  useEffect(() => {
    if (alreadyStartedGame) {
      history.go(1)
    }
  }, [alreadyStartedGame])

  const toggleTestMode = () => {
    if (testMode) {
      removeTestMode()
    } else {
      addTestMode()
    }
  }

  const handleClose = () => {
    // history.goBack()
    history.push(ROUTES.HOME)
  }
  return (
    <IonPage>
      {questionSet?.questions && (
        <>
          <NavBar rightIcon="close" rightAction={handleClose} title={title} />
          <IonContent>
            <IntroContainer>
              <div>{header}</div>

              <Sponsor sponsor={questionSet.sponsor || currentChallenge.sponsor} />

              <Infos>
                <Text1>{description}</Text1>
                <br />
                <Text2 className="icon icon-question">{questionsInfos}</Text2>

                {children}
              </Infos>
              <Container style={{ alignItems: "center" }}>
                {footer}
                {(authUser.hasRole(USER_ROLES.ADMIN) || testMode) && (
                  <>
                    <RegularLink onClick={toggleTestMode}>
                      {!testMode ? "Activer le mode Test" : "Desactiver le mode Test"}
                    </RegularLink>
                  </>
                )}
                <br />
              </Container>
            </IntroContainer>
          </IonContent>
        </>
      )}
    </IonPage>
  )
}

const durationConverter = (duration) => {
  return Math.floor(duration / 60) + ":" + ("0" + Math.floor(duration % 60)).slice(-2)
}

const IntroContainer = styled(FullScreenContainer)`
  text-align: center;
`

const Infos = styled(Container)`
  align-items: center;
  p {
    &:before {
      color: ${(props) => props.theme.icon.primary};
      font-size: 21px;
      top: 1px;
      left: -2px;
      position: relative;
    }
    &.icon-question:before {
      left: -6px;
    }
  }
`

const Sponsor = ({ sponsor }) => {
  return sponsor ? (
    <SponsorInfo>
      <Text2>{sponsor.quizIntroText}</Text2>
      <img src={sponsor.logo} />
    </SponsorInfo>
  ) : null
}

const SponsorInfo = styled.div`
  flex-direction: column;
  display: flex;
  max-height: 150px;
  background: white;
  color: black;
  align-items: center;
  padding: 8px 15px;
  img {
    max-height: 80px;
  }
`
