import { IonContent, IonPage } from "@ionic/react"
import moment from "moment"
import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { useLocation } from "react-router-dom/cjs/react-router-dom.min"
import styled from "styled-components"
import { Button, Container, NavBar, Text2, Text3, Title3, RegularLink } from "../../components"
import ROUTES from "../../constants/routes"
import { useCurrentChallenge } from "../../contexts"
import lotteryImage from "../../images/activities/lottery.svg"

export default () => {
  const { currentPlayer, currentChallenge } = useCurrentChallenge()
  const history = useHistory()
  const location = useLocation<any>()
  const [lottery] = useState(location?.state?.lottery)

  return !lottery ? null : (
    <IonPage>
      <NavBar rightIcon="close" rightAction={() => history.push(ROUTES.HOME)} title={lottery.name} />

      <IonContent>
        <PageContainer>
          <Title3>
            {currentPlayer.username || currentPlayer.firstName}, tu es maintenant inscrit.e au tirage du{" "}
            {moment(lottery.drawDate).format("DD/MM")} ! 🍀
          </Title3>
          <SubscriptionCount>{lottery.subscriptionCount} participants </SubscriptionCount>
          {lottery.description ? (
            <Text2 dangerouslySetInnerHTML={{ __html: lottery.description }} />
          ) : (
            <Text2>Résultats le {moment(lottery.drawDate).format("DD/MM")} sur la page :</Text2>
          )}

          {lottery.link && (
            <RegularLink href={lottery.link} target="_blank" rel="noreferrer">
              {lottery.link}{" "}
            </RegularLink>
          )}
          {lottery.prizesInfo && <Partners>{lottery.prizesInfo}</Partners>}

          <ImageContainer>
            {lottery.image ? <img src={lottery.image} /> : <img style={{ flex: 1, width: 120 }} src={lotteryImage} />}
          </ImageContainer>
          {currentChallenge.lotteriesInfo.rulesUrl && (
            <RegularLink href={currentChallenge.lotteriesInfo.rulesUrl} target="_blank" rel="noreferrer">
              Règlement du jeu concours
            </RegularLink>
          )}
          <br />
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

const SubscriptionCount = styled(Text3)`
  color: ${(props) => props.theme.text.tertiary};
  margin: 8px 0 4px 0;
`

const Partners = styled(Text3)`
  color: ${(props) => props.theme.text.tertiary};
  margin: 8px 0;
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
