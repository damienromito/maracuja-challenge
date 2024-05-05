import { useCurrentChallenge } from '@maracuja/shared/contexts'
import React from 'react'
import PlayerCardViewer from '../../components/PlayerCardViewer'

export default () => {
  const { currentPlayer, currentTeam } = useCurrentChallenge()

  return (
    <>
      <PlayerCardViewer
        popup
        onClickPopupButton={() => { }}
        team={currentTeam}
        player={currentPlayer}
      />
    </>
  )
}
