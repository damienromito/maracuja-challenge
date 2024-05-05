import { IonContent, IonPage } from "@ionic/react"
import React from "react"
import { useHistory } from "react-router-dom"
import styled from "styled-components"
import { ChallengeInfo, Container, HelpLink, NavBar, PartnersFooter, Title1 } from "../../components"
import { useCurrentChallenge } from "../../contexts"
import RulesComponent from "./RulesComponent"

const Rules = () => {
  const { currentChallenge } = useCurrentChallenge()
  const history = useHistory()
  return (
    <IonPage>
      <NavBar leftAction={() => history.goBack()} leftIcon="back" title="Règles du Challenge" />
      <IonContent>
        <PageContainer className="max-width-container">
          <ChallengeInfo challenge={currentChallenge} />

          <RulesComponent />

          <Faq>
            {currentChallenge.faq && (
              <>
                {" "}
                <Title1>FAQ</Title1>
                <div dangerouslySetInnerHTML={{ __html: currentChallenge.faq }} />
              </>
            )}
            <h2>Besoin d’aide supplémentaire ?</h2>
            <p>Cliquez sur le lien ci-dessous afin d’envoyer vos questions à l’équipe Maracuja</p>
            <HelpLink label="rules" />
          </Faq>
        </PageContainer>
      </IonContent>
      {currentChallenge.partners && <PartnersFooter partners={currentChallenge.partners} />}
    </IonPage>
  )
}

export default Rules

const PageContainer = styled(Container)`
  background: ${(props) => props.theme.primary};
  padding-bottom: 50px;
  padding-top: 30px;
  text-align: center;
`

const Faq = styled.div`
  text-align: left;
  h2 {
    margin: 25px 0 10px 0;
    color: ${(props) => props.theme.text.tertiary};
  }
  h3 {
    margin: 20px 0 8px 0;
  }
`
