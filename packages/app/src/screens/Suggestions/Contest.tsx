
import React from 'react'
import { ContestIcon, PlayButton, Text2, Text3 } from '../../components'
import { useCurrentChallenge } from '../../contexts'
import Container from './SuggestionContainer'

export default () => {
  const { currentQuestionSet } = useCurrentChallenge()

  return (
    <Container
      title='Épreuve en cours'
      infoContent={(
        <>
          <Text2>{currentQuestionSet.name}</Text2>
          <Text2>{currentQuestionSet.hasPlayed ? currentQuestionSet.getScore(true) : 'A toi de jouer !'}  </Text2>
          <Text3 className='text-white'>{currentQuestionSet.getAvaibilityString()}</Text3>
        </>
      )}
      iconContent={
        <ContestIcon score={currentQuestionSet.getScore()} large />
      }
      buttonContent={
        <PlayButton questionSet={currentQuestionSet} analyticsId='home' />
      }
    />
  )
}
