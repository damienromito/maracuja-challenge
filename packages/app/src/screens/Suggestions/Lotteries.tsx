import { objectSubset } from '@maracuja/shared/helpers'
import { Lottery } from '@maracuja/shared/models'
import moment from 'moment'
import React from 'react'
import { generatePath, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Text3, Text4 } from '../../components'
import ROUTES from '../../constants/routes'
import { useApp, useCurrentChallenge } from '../../contexts'
import lotteryImage from '../../images/activities/lottery.svg'

export default ({ lottery }) => {
  const { currentChallenge, currentPlayer, currentTeam } = useCurrentChallenge()
  const history = useHistory()
  const { setLoading, openAlert } = useApp()

  const handleClickParticipate = async () => {
    setLoading(true)
    const params = {
      challengeId: currentChallenge.id,
      lottery: objectSubset(lottery, ['id', 'phaseId']),
      player: objectSubset(currentPlayer, ['id', 'username']),
      team: objectSubset(currentTeam, ['id', 'name'])
    }

    const response = await Lottery.subscribeLottery(params)
    const updatedLottery = response.lottery
    setLoading(false)
    if (!updatedLottery) {
      if (response.message) openAlert({ message: response.message })
    } else {
      history.push(generatePath(ROUTES.LOTTERY, { lotteryId: updatedLottery.id }), { lottery: updatedLottery })
    }
  }

  return (
    <Container>

      <InfoContainer>
        <Title>{currentChallenge.lotteriesInfo.title}</Title>
        <Text3 style={{ textAlign: 'left', marginTop: 12 }}>{currentChallenge.lotteriesInfo.description}</Text3>
        {lottery.prizesInfo &&
          <Text4 style={{ textAlign: 'left', marginTop: 12, color: 'white' }}>{lottery.prizesInfo}</Text4>}
      </InfoContainer>
      <SubscribeContainer>
        <img style={{ flex: 1 }} src={lotteryImage} />
        <SubscribeButton small onClick={handleClickParticipate}>Participer</SubscribeButton>

        <Text4 style={{ color: 'white' }}>Tirage du {moment(lottery.drawDate).format('DD/MM')}</Text4>
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
