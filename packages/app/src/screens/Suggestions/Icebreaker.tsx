import React from 'react'
import { generatePath, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Button, RegularLink, Text3 } from '../../components'
import ROUTES from '../../constants/routes'
import { useCurrentChallenge } from '../../contexts'
import icebreakerImage from '../../images/activities/icebreaker.svg'

export default ({ onSuggestionHidden }) => {
  const { refreshCurrentChallenge, currentChallenge } = useCurrentChallenge()
  const history = useHistory()

  const handleClickParticipate = async () => {
    history.push(generatePath(ROUTES.ICEBREAKER_CREATE_QUESTION))
  }

  const handleHide = () => {
    onSuggestionHidden({ id: 'icebreaker', showDefaultPopup: true })
    refreshCurrentChallenge()// pour cacher la suggestion
  }

  return (
    <>
      <Container>

        <InfoContainer>
          <Title>{currentChallenge.icebreaker.title || 'Icebreaker'}</Title>
          <Text3 style={{ textAlign: 'left', marginTop: 12 }}>{currentChallenge.icebreaker.description}</Text3>
          <RegularLink style={{ textAlign: 'left' }} onClick={handleHide}>Masquer</RegularLink>

        </InfoContainer>
        <SubscribeContainer>
          <img style={{ flex: 1 }} src={icebreakerImage} />
        </SubscribeContainer>
      </Container>

      <SubscribeButton onClick={handleClickParticipate}>Participer</SubscribeButton>
    </>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction:row;
`
const SubscribeContainer = styled.div`
  display: flex;
  flex-direction:column;
  align-items: center;
  align-self:center;
`

const InfoContainer = styled.div`
  display: flex;
  flex:1;
  flex-direction:column;
  align-items: start;
  color: ${props => props.theme.text.secondary};
  margin-right: 8px;
  text-align:left;

`

const SubscribeButton = styled(Button)`
  height: 40px;
  margin : 5px 0 0 0;
`

const Title = styled.div`
text-transform: uppercase;
margin-top:3px;
font-family: Chelsea Market;
font-style: normal;
font-weight: normal;
font-size: 14px;
line-height: 18px;
`
