import { WHITELIST_TYPES } from '@maracuja/shared/constants'
import ROUTES from '../constants/routes'

const currentDate = (params = null) => {
  if (params) {
    return new Date(params)
  }
  // return new Date(Date.now() + (1000 * 3600 * 24))
  return new Date()
}

const signupRouteForAudience = (challengeAudience) => {
  if (challengeAudience.whitelist === WHITELIST_TYPES.MAILING_LIST) {
    return ROUTES.SIGN_UP__WHITE_LIST
  } else if (challengeAudience.whitelist === WHITELIST_TYPES.FFE_LICENSEES) {
    return ROUTES.SIGN_UP__LICENSE
  } else if (challengeAudience.whitelist === WHITELIST_TYPES.NONE) {
    if (challengeAudience.filters?.tribe?.length > 1) {
      return ROUTES.SIGN_UP_LEAGUEPICKER
    } else {
      return ROUTES.SIGN_UP_CLUBPICKER
    }
  }
}

const checkPlayerHasRequiredChallengeInfo = (player, challenge) => {
  // if(!currentPlayer.birthday){
  //   goToSignUpInfoForm()
  // }
  // else
  if (challenge.playerInfos?.birthday && !player.birthday) {
    return false
  }
  if (challenge.cguLink && !player.optinCgu) {
    return false
  } else if (challenge.optins) {
    for (let i = 0; i < challenge.optins.length; i++) {
      const item = challenge.optins[i]
      if (typeof player[item.id] === 'undefined' &&
        (!item.role || player.roles.includes(item.role))) {
        return false
      }
    }
  }
  return true
}

const normalizeString = (string) => {
  return string.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const getMailToLink = ({ email, cc = undefined, subject, body }) => {
  const result = `mailto:${email || 'bonjour@maracuja.ac'}?` +
    `&subject=${subject}` +
    (cc ? `&cc=${cc}` : '') +
    `&body=${body}`
  return result
}

export {
  signupRouteForAudience,
  checkPlayerHasRequiredChallengeInfo,
  normalizeString,
  currentDate,
  getMailToLink
}
