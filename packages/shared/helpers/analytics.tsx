
import { objectSubset } from '@maracuja/shared/helpers'
import firebase from 'firebase/app'
import 'firebase/analytics'
import { PLAYER_ROLES } from '@maracuja/shared/constants'

const updateAnalyticsUserProperties = (player) => {
  const analyticsData = objectSubset(player, [
    // 'username',
    'challengeId'
    // 'id'
  ])
  if (player.club) {
    analyticsData.clubId = player.club.id
    analyticsData.clubName = player.club.name
  }
  if (player.roles?.includes(PLAYER_ROLES.CAPTAIN)) {
    analyticsData.isCaptain = true
    analyticsData.captain = true
  }
  if (player.roles?.includes(PLAYER_ROLES.REFEREE)) {
    analyticsData.referee = true
    analyticsData.isReferee = true
  }
  firebase.analytics().setUserProperties(analyticsData)
}

export {
  updateAnalyticsUserProperties
}
