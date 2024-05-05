import React from 'react'
import { useCurrentOrganisation } from '../../contexts'
import Default from './Default'
import Organisation from './Organisation'

export default () => {
  const { currentOrganisation, currentOrganisationLoading } = useCurrentOrganisation()

  return currentOrganisationLoading
    ? null
    : currentOrganisation
      ? <Organisation />
      : <Default />
}
