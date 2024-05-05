
import ROLES from '@maracuja/shared/constants/roles'
import React from 'react'
import styled from 'styled-components'
import { Button, Text2, Title2 } from '../../components'
import { useCurrentChallenge } from '../../contexts'
import Feedbackimage from '../../images/feedback.png'

export default () => {
  const { currentPlayer, currentChallenge } = useCurrentChallenge()

  const onClickFeedback = () => {
    let url = currentChallenge.feedback.url + '?'
    // url += '&email=' + currentPlayer.email || ''
    url += '&dbid=' + currentPlayer.id
    url += '&captain=' + currentPlayer.hasRole(ROLES.CAPTAIN)
    url += '&referee=' + currentPlayer.hasRole(ROLES.REFEREE)
    window.open(url, '_blank')
  }

  return (
    <FeedbackContainer>
      <Title2>C'est l'heure du bilan ! 🤗</Title2>
      <Text2>Hello {currentPlayer.username},</Text2>
      <Text2><b>C'est l'heure pour nous de faire le bilan et on a besoin de toi ! ❤️</b></Text2>

      <Text2>
        {currentChallenge.feedback.text}
      </Text2>
      {currentChallenge.feedback.image &&
        <img
          src={currentChallenge.feedback.image === true
            ? Feedbackimage
            : currentChallenge.feedback.image} onClick={() => onClickFeedback()}
        />}
      <Button onClick={() => onClickFeedback()}>DONNE TON AVIS</Button>
    </FeedbackContainer>
  )
}
const FeedbackContainer = styled.div`
  .text-2{text-align: left;}
  color : black;
  img{
    margin-top: 10px;
    cursor:pointer;
    max-width: 100%;
    max-height: 200px;
  }
`
