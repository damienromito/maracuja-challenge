import { IonContent, IonPage } from "@ionic/react"
import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { useLocation } from "react-router-dom/cjs/react-router-dom.min"
import styled from "styled-components"
import { Button, Container, NavBar, Text2 } from "../../components"
import ROUTES from "../../constants/routes"
import { useCurrentChallenge } from "../../contexts"
import externalActivityImage from "../../images/activities/externalActivity.svg"

export default () => {
  const { currentPlayer, currentChallenge } = useCurrentChallenge()
  const history = useHistory()
  const location = useLocation<any>()
  const [externalActivity] = useState(location?.state?.externalActivity)

  return !externalActivity ? null : (
    <IonPage>
      <NavBar rightIcon="close" rightAction={() => history.push(ROUTES.HOME)} title={externalActivity.name} />

      <IonContent>
        <PageContainer>
          <Text2 dangerouslySetInnerHTML={{ __html: externalActivity.description }} />

          <ImageContainer>
            {externalActivity.image ? (
              <img src={externalActivity.image} />
            ) : (
              <img style={{ flex: 1, width: 120 }} src={externalActivityImage} />
            )}
          </ImageContainer>

          <Button onClick={() => history.push(ROUTES.HOME)}>OK</Button>
        </PageContainer>
      </IonContent>
    </IonPage>
  )
}

const PageContainer = styled(Container)`
  background: ${(props) => props.theme.primary};
  padding: 15px;
  text-align: center;
`

const ImageContainer = styled.div`
  text-align: center;
  img {
    width: inherit;
    height: inherit;
    margin: 10px 0;
    max-width: 100%;
  }
`
