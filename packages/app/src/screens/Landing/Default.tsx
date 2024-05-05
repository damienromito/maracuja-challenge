import { IonContent, IonPage } from "@ionic/react"
import { Challenge } from "@maracuja/shared/models"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router"
import styled from "styled-components"
import "swiper/css/swiper.css"
import {
  ChallengesSlider,
  CodeChallengeForm,
  FullScreenContainer,
  LandingLogo,
  NavBar,
  RegularLink,
  Spinner,
  Text1,
  Text4,
} from "../../components"
import ROUTES from "../../constants/routes"
import { useApi, useAuthUser } from "../../contexts"

export default () => {
  const { authUser } = useAuthUser()
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [highlightedChallenges, setHighlightedChallenges] = useState(null)
  const [displayCodeForm, setDisplayCodeForm] = useState(true)

  const history = useHistory()

  useEffect(() => {
    const unsubscribe = handleShowPublicChallenges()
    return () => {
      unsubscribe()
    }
  }, [])

  const handleShowPublicChallenges = () => {
    setLoading(true)
    return Challenge.fetchPublicChallenges((challenges) => {
      if (challenges?.length) {
        setHighlightedChallenges(challenges)
      }
      setLoading(false)
    })
  }

  // return <WebLanding />
  return (
    <IonPage>
      {authUser && (
        <NavBar
          title={`Hello ${authUser.username + " " || ""}!`}
          rightIcon="settings"
          rightAction={() => history.push(ROUTES.SETTINGS)}
        />
      )}
      <IonContent>
        {loading ? (
          <Spinner />
        ) : (
          <PageContainer style={{ height: displayCodeForm ? "auto" : "100vh" }}>
            {/* <PageContainer> */}
            <LandingLogo />

            <InfoContainer>
              <strong>Rejoins ton équipe</strong>
              <br />
              <Text1 className="center">
                Défie les autres équipes au travers des quiz qui te permettent d'en apprendre toujours plus !
              </Text1>
            </InfoContainer>

            {highlightedChallenges && <ChallengesSlider challenges={highlightedChallenges} />}
            <hr />
            {displayCodeForm || !highlightedChallenges ? (
              <CodeChallengeForm titleForm="Rejoins un challenge privé" />
            ) : (
              <RegularLink
                style={{ marginTop: 20 }}
                data-test="button-show-input-code"
                onClick={() => setDisplayCodeForm(true)}
              >
                Rejoindre un challenge privé
              </RegularLink>
            )}
            <Text4 style={{ marginTop: 20, marginBottom: 20 }}>Versions : {process.env.REACT_APP_VERSION}</Text4>
            {/* </PageContainer> */}
          </PageContainer>
        )}
      </IonContent>
    </IonPage>
  )
}

const PageContainer = styled(FullScreenContainer)`
  justify-content: space-around;
  text-align: center;

  /* .landing-logo{
    margin: 10px 0 10px;
  } */
`

const InfoContainer = styled.div`
  @media (max-height: 600px) {
    display: none;
  }
  padding: 0 15px 0 15px;
  color: ${(props) => props.theme.text.tertiary};
`
