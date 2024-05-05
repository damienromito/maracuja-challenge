import React from 'react'
import styled from 'styled-components'
import {
  Text2, Title1, Title2, TitleDate
} from '../../components'
import PhaseListItem from '../../components/PhaseListItem'
import { useCurrentChallenge } from '../../contexts'
import topXIcon from '../../images/topXIcon.png'

const RulesContainer = styled.div`
  text-align : center;
  margin: 30px 0;
  /* padding-bottom:200px; */
  p{
    max-width : 330px; 
    margin: 0 auto;
  }
`

const PhasesContainer = styled.div`
  margin-bottom : 15px;
  counter-reset: phase;
 
`

export default () => {
  const { currentChallenge } = useCurrentChallenge()

  return (
    <RulesContainer>
      <Title1>Les règles</Title1>
      <Text2> {currentChallenge.rules}</Text2>

      {currentChallenge.topPlayersEnabled &&
        <div style={{ marginTop: 25 }}>

          <TitleDate>🔥 TOP {currentChallenge.topPlayers.members} 🔥</TitleDate>
          <Title2>Score de ton {currentChallenge.wording.tribe}</Title2>
          <img src={topXIcon} width='120' />
          <Text2>{currentChallenge.topPlayers.rules}</Text2>

        </div>}
      <br />
      {currentChallenge.phases.length > 1 &&
        <PhasesContainer>

          {currentChallenge.phases.map((x, i) => {
            return <PhaseListItem key={x.id} phase={x} showDescription />
          })}
        </PhasesContainer>}
    </RulesContainer>
  )
}
