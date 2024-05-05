import React, { useEffect, useState } from "react"
import { generatePath, useHistory } from "react-router-dom"
import styled from "styled-components"
import { Button, Text3, Text4 } from "../../components"
import ROUTES from "../../constants/routes"
import { useCurrentChallenge } from "../../contexts"
import activityImage from "../../images/activities/ideasBox.svg"

export default ({ ideasBox }) => {
  const { currentPlayer, currentPhase } = useCurrentChallenge()
  const history = useHistory()
  const [ideaCount, setIdeaCount] = useState(null)

  const handleClickIdeasBoxParticipate = () => {
    history.push(generatePath(ROUTES.IDEAS_BOX, { ideasBoxId: ideasBox.id }))
  }

  useEffect(() => {
    setIdeaCount(
      currentPlayer.scores?.[ideasBox?.phaseId || currentPhase?.id]?.ideasBoxes
        ?._stats?.count
    )
  }, [currentPlayer])

  return (
    <Container>
      <InfoContainer>
        <Title>{ideasBox.name}</Title>
        <Text3 style={{ textAlign: "left", marginTop: 12 }}>
          {ideasBox.description}
        </Text3>
      </InfoContainer>
      <SubscribeContainer>
        <img style={{ flex: 1 }} src={activityImage} />
        <SubscribeButton small onClick={handleClickIdeasBoxParticipate}>
          Participer
        </SubscribeButton>
        {ideaCount && (
          <Text4 style={{ color: "white" }}>
            Tu as déposé {ideaCount} idée(s)
          </Text4>
        )}
      </SubscribeContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
`
const SubscribeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const InfoContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: start;
  color: ${(props) => props.theme.text.secondary};
  margin-right: 8px;
`

const SubscribeButton = styled(Button)`
  height: 40px;
  margin: 5px 0 0 0;
`

const Title = styled.div`
  text-transform: uppercase;
  margin-top: 3px;
  font-family: Chelsea Market;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 18px;
`
