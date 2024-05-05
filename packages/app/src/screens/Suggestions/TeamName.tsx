
import { capitalizeFirstLetter } from '@maracuja/shared/helpers'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from '../../components'
import ROUTES from '../../constants/routes'
import { useCurrentChallenge } from '../../contexts'
import Suggestion from './Suggestion'

export default () => {
  const { currentChallenge } = useCurrentChallenge()
  const history = useHistory()
  return (
    <Suggestion>
      <p>{capitalizeFirstLetter(currentChallenge.wording?.captain)}, à toi de choisir un nom d’équipe</p>
      <Button onClick={() => history.push(ROUTES.EDIT_ACTIVE_CLUB)}>Choisir un nom d’équipe</Button>
    </Suggestion>
  )
}
