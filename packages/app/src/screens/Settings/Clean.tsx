import { useCurrentOrganisation } from '@maracuja/shared/contexts'
import React, { useEffect } from 'react'
import { Spinner } from '../../components'
import ROUTES from '../../constants/routes'
import { useAuthUser, useCurrentChallenge } from '../../contexts'

const Clean = ({ history }) => {
  const { onSignOut } = useAuthUser()
  const { setCurrentChallengeById } = useCurrentChallenge()
  const { setCurrentOrganisationById } = useCurrentOrganisation()

  useEffect(() => {
    onSignOut().then(() => {
      setCurrentChallengeById(null)
      setCurrentOrganisationById(null)
      history.push(ROUTES.HOME)

      window.location.reload()
    })
  }, [])

  return <Spinner />
}

export default Clean
