import React from 'react'
import { Redirect } from 'react-router-dom'
import { useAuthUser, useCurrentChallenge, useCurrentOrganisation } from '../../contexts'
import ChallengeLanding from '../Landing/Challenge'

const HomePage = (props) => {
  const { authUser } = useAuthUser()
  const { currentChallenge } = useCurrentChallenge()
  const { currentOrganisation } = useCurrentOrganisation()

  if (!currentOrganisation) {
    return <ChallengeLanding {...props} />
  }

  if (!currentChallenge || !authUser?.challengeIds?.includes(currentChallenge.id)) {
    return <ChallengeLanding {...props} />
  }

  return <Redirect to='/challenge' />
}

export default HomePage
