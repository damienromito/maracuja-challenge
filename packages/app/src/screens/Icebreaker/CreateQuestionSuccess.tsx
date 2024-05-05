import { IonContent, IonPage } from "@ionic/react"
import { Text2, Title1 } from "@maracuja/shared/components"
import React from "react"
import { useHistory } from "react-router-dom"
import styled from "styled-components"
import { Container, NavBar } from "../../components"
import ROUTES from "../../constants/routes"
import IcebreakerButton from "../Team/IcebreakerButton"

export default () => {
  const history = useHistory()

  const handleClose = () => {
    history.push(ROUTES.HOME)
  }

  return (
    <IonPage>
      <NavBar rightIcon="close" rightAction={handleClose} title="2 vérités 1 mensonge" />
      <IonContent>
        <PageContainer className="max-width-container">
          <Title1>Ta question a été ajoutée ✅</Title1>
          <br />
          <Text2>Tes coéquipiers vont maintenant devoir deviner lesquelles de ces anecdotes sont vraies ! 😇</Text2>
          <br />
          <IcebreakerButton />
          <br />
        </PageContainer>
      </IonContent>
    </IonPage>
  )
}

const PageContainer = styled(Container)`
  background: ${(props) => props.theme.primary};
  padding: 15px;
`
