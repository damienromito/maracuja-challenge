import React from 'react'
import { generatePath, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Button, RegularLink, Text3 } from '../../components'
import ROUTES from '../../constants/routes'
import { useCurrentChallenge } from '../../contexts'
import externalActivityImage from '../../images/activities/externalActivity.svg'

export default ({ externalActivity, onSuggestionHidden }) => {
  const { currentChallenge, refreshCurrentChallenge } = useCurrentChallenge()
  const history = useHistory()

  const handleClickDetail = async () => {
    history.push(generatePath(ROUTES.EXTERNAL_ACTIVITY, { externalActivityId: externalActivity.id }), { externalActivity })
  }

  const handleHide = () => {
    onSuggestionHidden({ id: externalActivity.id, showDefaultPopup: true })
    refreshCurrentChallenge()// pour cacher la suggestion
  }

  return (
    <Container>

      <InfoContainer>
        <Title>{externalActivity.name || 'Activité'}</Title>
        <Text3 style={{ textAlign: 'left', marginTop: 12 }}>{externalActivity.preview}</Text3>
        <RegularLink style={{ textAlign: 'left', fontSize: 13 }} onClick={handleHide}>Masquer </RegularLink>

      </InfoContainer>
      <SubscribeContainer>
        <img style={{ flex: 1 }} src={externalActivityImage} />
        <SubscribeButton small onClick={handleClickDetail}>Voir</SubscribeButton>
      </SubscribeContainer>

    </Container>
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
