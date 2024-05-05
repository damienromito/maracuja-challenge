import { IonContent, IonPage } from "@ionic/react"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { useInterval } from "@maracuja/shared/hooks"
import React, { useState, useMemo, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { useLocation } from "react-router-dom/cjs/react-router-dom.min"
import styled from "styled-components"
import { Container, NavBar } from "../../components"
import ROUTES from "../../constants/routes"

export default () => {
  const history = useHistory()
  const { currentPlayer } = useCurrentChallenge()
  const location = useLocation<any>()
  const [survey] = useState(location?.state?.survey)
  const [formLoaded, setFormLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setFormLoaded(true)
    }, 5000)
  }, [])

  const formUrl = useMemo(() => {
    let url = `https://docs.google.com/forms/d/e/${survey.formId}/viewform?embedded=true`
    if (survey.prefilledPlayerIdField) {
      url += `&entry.${survey.prefilledPlayerIdField}=${currentPlayer.id}`
    }
    return url
  }, [survey])

  return !survey ? null : (
    <IonPage>
      <NavBar rightIcon="close" rightAction={() => history.push(ROUTES.HOME)} title={survey.name} />

      <IonContent>
        <PageContainer>
          <iframe src={formUrl} width="100%" height="100%" frameBorder="0" marginHeight={0} marginWidth={0}>
            Chargement…
          </iframe>
          {!formLoaded && <p>Chargement...</p>}
        </PageContainer>
      </IonContent>
    </IonPage>
  )
}

const PageContainer = styled(Container)`
  background: ${(props) => props.theme.primary};
  padding: 15px;
  height: 100%;
  text-align: center;
`
