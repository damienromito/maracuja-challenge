
import React, { useContext } from 'react'
import { generatePath, useHistory } from 'react-router-dom'
import {
  Button, Title3
} from '../../components'
import ROUTES from '../../constants/routes'
import { GameContext, useCurrentChallenge } from '../../contexts'
import icebreakerImage from '../../images/activities/icebreaker.svg'
import GameIntro from '../Game/GameIntro'

export default () => {
  const { currentPlayer } = useCurrentChallenge()

  const { questionSet } = useContext(GameContext)
  const history = useHistory()

  const handleClickCreateQuestion = () => {
    history.push(generatePath(ROUTES.ICEBREAKER_CREATE_QUESTION))
  }

  const handleClickStartIcebreaker = () => {
    history.push(generatePath(ROUTES.ICEBREAKER_PLAY, { questionSetId: questionSet.id }))
  }

  return (
    <GameIntro
      title='Découvre ton équipe'
      description={questionSet.description}
      header={(
        <>
          <img style={{ flex: 1 }} src={icebreakerImage} />
          <Title3 style={{ marginTop: 5 }}>{questionSet.name}</Title3>
        </>
      )}
      questionsInfos={`${questionSet.questions.length} coéquipiers à découvrir`}
      footer={(
        <>
          <Button style={{ marginBottom: 8 }} onClick={handleClickStartIcebreaker}>Découvrir ton équipe</Button>
          <Button secondary onClick={handleClickCreateQuestion}>{currentPlayer.icebreaker?.questionCreationCount ? 'Modifie' : 'Crée'} ta question</Button>
        </>
      )}
    />
  )
}
