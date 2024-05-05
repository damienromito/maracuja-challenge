
import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, RegularLink } from '../../components'
import ROUTES from '../../constants/routes'
import { useCurrentChallenge } from '../../contexts'
import Suggestion from './Suggestion'

export default ({ onSuggestionHidden }) => {
  const { currentPlayer, refreshCurrentChallenge } = useCurrentChallenge()
  const history = useHistory()

  const handleHide = () => {
    onSuggestionHidden({ id: 'playerCard', showDefaultPopup: true })
    refreshCurrentChallenge()// pour cacher la suggestion
  }

  return (
    <Suggestion>
      <p>{currentPlayer.username}, tu peux maintenant avoir une carte pour représenter ton équipe !</p>
      <Button onClick={() => history.push(`${ROUTES.EDIT_CURRENT_PLAYER}/photo`)}>Créer ma carte joueur</Button>
      <RegularLink onClick={handleHide}>Plus tard</RegularLink>
    </Suggestion>
  )
}
