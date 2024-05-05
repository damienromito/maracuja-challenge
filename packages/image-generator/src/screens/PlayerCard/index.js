import PlayerCard from '@maracuja/app/src/components/PlayerCard'
import React from 'react'
import PlaceholderClubAvatar from '@maracuja/shared/images/placeholders/placeholder-club-avatar.png'

export default () => {
  const { player, team, challenge } = window.generatedData
  console.log('data:', window.generatedData)

  const logoUrl = team.logo?.['400'] || PlaceholderClubAvatar
  const avatarUrl = player.avatar?.['400'] || player.avatar?.original
  return (
    <>
      <div style={{ display: 'flex', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <PlayerCard
          teamLogoUrl={logoUrl}
          teamName={team.name}
          colors={team.colors}
          player={player}
          playerUsername={player.username}
          playerNumber={player.number}
          challengeImage={challenge.image}
          challengePlayersAvatarWithoutBackground={challenge.playersAvatarWithoutBackground}
          removeBackground={player.avatar?.removeBackground}
          avatarUrl={ avatarUrl || logoUrl }
        />
      </div>
    </>
  )
}
