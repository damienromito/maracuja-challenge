
import { ACTIVITY_TYPES } from '@maracuja/shared/constants'
import ROLES from '@maracuja/shared/constants/roles'
import React, { useContext } from 'react'
import { ContestIcon, PlayButton, Text2, Title3 } from '../../components'
import { GameContext, useCurrentChallenge } from '../../contexts'
import GameIntro from '../Game/GameIntro'
import { Button } from '@maracuja/shared/components'
import { useHistory } from 'react-router-dom'

export default () => {
  const { questionSet } = useContext(GameContext)
  const { currentPlayer, currentChallenge } = useCurrentChallenge()
  const history = useHistory()

  const warmupInCompet = () => {
    history.push(`/contests/${questionSet.id}/play`, { warmUpInCompet: true })
  }

  return (
    <GameIntro
      title='Épreuve'
      header={(
        <>
          <ContestIcon
            score={questionSet._stats?.score}
            large
          />

          <Title3 style={{ marginTop: 5 }}>{questionSet.name}</Title3>
        </>
      )}
      description={questionSet.description || "C'est parti ! Donne tout et collectionne le plus de points pour ton équipe !"}
      questionsInfos={`${questionSet.questions.length} questions ${questionSet.questionCountMax != null && questionSet.questionCountMax > 0 ? 'max' : ''}`}
      footer={(
        <>
          {questionSet.warmUpQuestions &&
            <Button onClick={warmupInCompet} secondary style={{ marginBottom: 10 }}>S'échauffer</Button>}
          <PlayButton questionSet={questionSet} analyticsId='game-intro' withoutIntro hasCountDown title='Lancer le quiz' />
        </>
      )}
    >
      <>
        {questionSet.duration
          ? <Text2>⏱ <strong>{durationConverter(questionSet.duration) + ' min'}</strong> pour répondre à un maximum de questions !</Text2>
          : <Text2>⏱ Aucune limite de temps</Text2>}

        {currentPlayer.hasRole(ROLES.REFEREE) && questionSet.type === ACTIVITY_TYPES.CONTEST && questionSet.questions.length > 5 &&
          <Text2 className='icon icon-supporter'>En tant que filleul.e, tu peux rapporter jusqu’à 5 points à {currentChallenge.wording.yourTribe} !</Text2>}
      </>
    </GameIntro>
  )
}

const durationConverter = (duration) => {
  return Math.floor(duration / 60) + ':' + ('0' + Math.floor(duration % 60)).slice(-2)
}
