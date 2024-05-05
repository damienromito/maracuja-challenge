import { useCurrentChallenge } from '@maracuja/shared/contexts'
import React from 'react'
import { Text2 } from '.'
import { capitalizeFirstLetter } from '@maracuja/shared/helpers'

export default ({ priceCount, isFinale }) => {
  const { currentChallenge } = useCurrentChallenge()
  if (!priceCount) {
    return null
  } else {
    const teamString = priceCount > 1 ? `Les ${priceCount} ${currentChallenge.wording.firstTribes}` : capitalizeFirstLetter(currentChallenge.wording.theFirstTribe)
    return isFinale
      ? <Text2 className='prized'>🏆 {teamString} monte sur le podium !</Text2>
      : <Text2 className='prized'>⭐️ Les {priceCount} {currentChallenge.wording.firstTribes} se qualifient pour la phase suivante.</Text2>
  }
}
