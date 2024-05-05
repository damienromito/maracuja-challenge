import { IonContent, IonPage } from "@ionic/react"
import React from "react"
import { useHistory, useLocation } from "react-router-dom"
import styled from "styled-components"
import { Button, Container, NavBar, Text2, Text3, Title1 } from "../../components"
import ROUTES from "../../constants/routes"

const PageContainer = styled(Container)`
  text-align: center;
  background: ${(props) => props.theme.primary};
  padding: 15px;
`

export default () => {
  const history = useHistory()
  const location = useLocation<any>()

  const onClickOk = () => {
    history.push(ROUTES.HOME)
  }

  return (
    <>
      <IonPage>
        <NavBar title="Mon innovation" />
        <IonContent>
          <PageContainer className="max-width-container">
            <Title1 style={{ marginBottom: "15px" }}>Participation enregistrée ✅</Title1>
            <div style={{ marginBottom: "15px" }}>
              <Text2>🗓 Rendez-vous le {location?.state?.event?.periodString}</Text2>
              <Text3>Un rappel t'a été envoyé par email</Text3>
            </div>
            <Button style={{ marginBottom: "15px" }} onClick={onClickOk}>
              OK
            </Button>
          </PageContainer>
        </IonContent>
      </IonPage>
    </>
  )
}
