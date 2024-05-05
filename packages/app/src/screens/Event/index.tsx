import { IonContent, IonPage } from "@ionic/react"
import { objectSubset } from "@maracuja/shared/helpers"
import { Event } from "@maracuja/shared/models"
import moment from "moment"
import React, { useLayoutEffect, useState } from "react"
import { generatePath, useHistory, useParams } from "react-router-dom"
import styled from "styled-components"
import { Button, Container, NavBar, RegularLink, Text2, Title2 } from "../../components"
import ROUTES from "../../constants/routes"
import { useApp, useCurrentChallenge } from "../../contexts"

const PageContainer = styled(Container)`
  background: ${(props) => props.theme.primary};
  padding: 15px;
`

export default () => {
  const { currentPlayer, currentChallenge, currentTeam, currentActivities } = useCurrentChallenge()
  const history = useHistory()
  const { eventId } = useParams<any>()
  const { loading, setLoading, openError } = useApp()
  const [event, setEvent] = useState(null)

  useLayoutEffect(() => {
    if (!event) {
      const e = currentActivities.find((a) => a.id === eventId)
      e.periodString = `${moment(e.eventStartDate).format("dddd D MMM[, de] HH[h]mm")} à ${moment(
        e.eventEndDate
      ).format("HH[h]mm")}`
      setEvent(e)
      setLoading(false)
    }
  }, [])

  const onClickSkip = () => {
    history.push(ROUTES.HOME)
  }

  const handleClickEventParticipate = async () => {
    setLoading(true)
    const data = {
      challenge: objectSubset(currentChallenge, ["id", "name", "emailTemplateId"]),
      event: objectSubset(event, ["id", "phaseId", "name", "periodString"]),
      team: objectSubset(currentTeam, ["id", "name"]),
      player: objectSubset(currentPlayer, ["id", "username", "firstName", "lastName"]),
    }

    try {
      await Event.subscribeEvent(data)
      history.push(generatePath(ROUTES.EVENT_SUBSCRIPTION_SAVED, { eventId }), { event })
    } catch (error) {
      openError(error)
    }

    setLoading(false)
  }

  return (
    <IonPage>
      <NavBar title="Mon innovation" />
      <IonContent>
        {event && (
          <div>
            <PageContainer className="max-width-container">
              <Title2 style={{ marginBottom: "15px" }}>{event.name}</Title2>
              <div style={{ marginBottom: "15px" }}>
                <Text2>
                  <b>Date de l’atelier : </b>
                  Le {event.periodString}
                </Text2>
              </div>
              <img style={{ flex: 1, marginBottom: "15px", width: "100%", height: "100%" }} src={event.image} />
              <Text2 style={{ marginBottom: "15px" }} dangerouslySetInnerHTML={{ __html: event.description }} />

              <Button style={{ marginBottom: "15px" }} disabled={loading} onClick={handleClickEventParticipate}>
                PARTICIPER À L’ATELIER
              </Button>
              <RegularLink onClick={onClickSkip} style={{ marginBottom: "15px" }}>
                Passer
              </RegularLink>
            </PageContainer>
          </div>
        )}
      </IonContent>
    </IonPage>
  )
}
