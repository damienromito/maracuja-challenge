import React from 'react'
import styled from 'styled-components'
import { ProgressBar, RegularLink, ShareButton, Text3 } from '../../components'
import { useCurrentChallenge } from '../../contexts'
import playerTeamImage from '../../images/activities/playerCountMinimum.svg'
import Suggestion from './Suggestion'

export default ({ onSuggestionHidden }) => {
  const { currentChallenge, refreshCurrentChallenge, currentTeam } = useCurrentChallenge()
  const remainingPlayers = currentChallenge.onboarding.playerCountMinimum - currentTeam.playerCount

  const handleHide = () => {
    onSuggestionHidden({ id: 'playerCountMinimum', showDefaultPopup: true })
    refreshCurrentChallenge()// pour cacher la suggestion
  }

  const percent = (currentTeam.playerCount / currentChallenge.onboarding.playerCountMinimum) * 100
  const remainString = `${currentTeam.playerCount}/${currentChallenge.onboarding.playerCountMinimum}`
  return (
    <Suggestion>
      <Title>Il manque {remainingPlayers} joueurs dans {currentChallenge.wording.theTribe}</Title>
      <ProgressBar percent={percent} style={{ marginTop: 10 }} text={remainString} />
      <InfoContainer>
        <Text3 style={{ textAlign: 'left', marginTop: 12 }}>Une équipe c'est avant tout des coéquipiers. {currentChallenge.onboarding.playerCountMinimum} joueurs est un minimum pour faire la différence contre les autres {currentChallenge.wording.tribes}.</Text3>
        <img style={{ flex: 1 }} src={playerTeamImage} />
      </InfoContainer>
      <ShareButton contentType='member'>{currentChallenge.wording.inviteAPlayer}</ShareButton>

      <RegularLink onClick={handleHide}>Ignorer</RegularLink>
    </Suggestion>
  )
}

const Title = styled.div`
text-transform: uppercase;
margin-top:3px;
font-family: Chelsea Market;
font-style: normal;
font-weight: normal;
font-size: 14px;
line-height: 18px;
`

const InfoContainer = styled.div`
  display: flex;
  flex:1;
  flex-direction:row;
  align-items: start;
  color: ${props => props.theme.text.secondary};
  margin-right: 8px;
  text-align:left;
  img{    
    max-width: 70px;
    margin : 20px;
  }

`
