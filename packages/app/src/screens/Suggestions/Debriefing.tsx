
import React from 'react'
import styled from 'styled-components'
import { ContestIcon, DebriefingButton, DebriefingIcon, Text2, Text3 } from '../../components'
import { useCurrentChallenge } from '../../contexts'
import moment from 'moment'
import Container from './SuggestionContainer'

export default () => {
  const { currentDebriefingContest } = useCurrentChallenge()
  return (
    <Container
      title="Debriefing de l'épreuve !"
      infoContent={(
        <>
          <ContestPreview>
            <ContestIcon score={currentDebriefingContest.getScore()} />
            <Text2>{currentDebriefingContest.name}</Text2>
          </ContestPreview>
          <Text2>Débriefée à {currentDebriefingContest.getDebriefingProgression(true)}</Text2>
          <Text3 className='text-white'>{currentDebriefingContest.debriefingEndDate
            ? `Il te reste ${moment(currentDebriefingContest.debriefingEndDate).fromNow(true)} pour revoir tes erreurs`
            : 'Revois tes erreurs'}
          </Text3>
        </>
      )}
      iconContent={
        <DebriefingIcon progression={currentDebriefingContest.getDebriefingProgression()} large />
      }
      buttonContent={
        <DebriefingButton contestToDebrief={currentDebriefingContest} />
      }
    />
  )
}

const ContestPreview = styled.div`
  display:flex;
  .activity-icon{width: 30px}

`
