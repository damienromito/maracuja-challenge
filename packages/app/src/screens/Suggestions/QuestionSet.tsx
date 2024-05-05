
import { ACTIVITY_TYPES } from '@maracuja/shared/constants'
import React from 'react'
import { useCurrentChallenge } from '../../contexts'
import Contest from './Contest'
import Training from './Training'

export default () => {
  const { currentQuestionSet } = useCurrentChallenge()

  return currentQuestionSet.type === ACTIVITY_TYPES.CONTEST
    ? <Contest />
    : <Training />
}
