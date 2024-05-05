
import { objectSubset } from '@maracuja/shared/helpers'
import React from 'react'
import { Button, RegularLink } from '../../components'
import { useApi, useApp, useCurrentChallenge } from '../../contexts'
import Suggestion from './Suggestion'

export default ({ onSuggestionHidden }) => {
  const { setLoading, loading } = useApp()
  const { currentPlayer, currentChallenge } = useCurrentChallenge()
  const subscribe = async () => {
    setLoading(true)
    try {
      await currentPlayer.subscribeToEmailChallengeTips({
        mailjetListId: currentChallenge.mailjetListId,
        challengeId: currentChallenge.id
      })
      onSuggestionHidden({ id: 'emailTips' })
    } catch (error) {

    }
    setLoading(false)
  }
  const handleHide = () => {
    onSuggestionHidden({
      id: 'emailTips',
      title: "Ne jamais recevoir d'emails du challenge ? 😱",
      message: 'Cette action est definitive, tu ne pourras plus activer ces emails par la suite.'
    })
  }
  // const handleAccept = () => {
  //   openAlert({
  //     title: 'Tu recevras les tips du challenge par email 🍬 ',
  //     message: 'Tu pourras te désabonner à tout moment',
  //     buttons: ['Annuler',
  //       { text: 'OK', handler: subscribe }
  //     ]
  //   })
  //   //
  //   // onSuggestionHidden('emailTips')
  // }
  return (
    <Suggestion>
      <p>🍬 Recevoir les astuces et les actualités des challenges par email ? 🍭 La plupart des autres joueurs ont déjà accepté</p>
      <Button onClick={subscribe} disabled={loading}>RECEVOIR LES ASTUCES</Button>
      <RegularLink onClick={handleHide}>Non merci</RegularLink>
    </Suggestion>
  )
}
