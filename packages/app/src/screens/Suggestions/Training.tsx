
import React from 'react'
import { PlayButton, Text2, Text3, TrainingButton, TrainingIcon } from '../../components'
import { useCurrentChallenge } from '../../contexts'
import Container from './SuggestionContainer'

export default () => {
  const { currentQuestionSet } = useCurrentChallenge()

  return (
    <Container
      title='Entrainement en cours'
      infoContent={(
        <>
          <Text2>{currentQuestionSet.name}</Text2>
          <Text2>{currentQuestionSet.hasPlayed ? `Entrainé à ${currentQuestionSet.getProgression(true)}` : 'A toi de jouer !'}  </Text2>
          <Text3 className='text-white'>{currentQuestionSet.getAvaibilityString()}</Text3>
        </>
      )}
      iconContent={
        <TrainingIcon progression={currentQuestionSet.getProgression()} large />
      }
      buttonContent={<TrainingButton training={currentQuestionSet} />}

    />
  )
}
