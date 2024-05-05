import {
  useAuthUser,
  useCurrentChallenge,
  useCurrentOrganisation,
} from "@maracuja/shared/contexts"
import React from "react"
import { Route, Switch } from "react-router-dom"
import { NotFound } from "@maracuja/shared/components"

export default ({ routes }) => {
  const { currentPlayer } = useCurrentChallenge()
  const { currentMember } = useCurrentOrganisation()
  const { authUser } = useAuthUser()

  const routesToReturn = routes.map(
    (
      { path, component, userRoles, organisationRoles, challengeRoles },
      index
    ) => {
      if (userRoles) {
        if (
          !authUser ||
          (userRoles.length > 0 && !authUser.hasRoles(userRoles))
        )
          return null
      } else if (authUser) return null

      if (organisationRoles) {
        if (
          !currentMember ||
          (organisationRoles.length > 0 &&
            !currentMember.hasRoles(organisationRoles))
        ) {
          return null
        }
      }

      if (challengeRoles) {
        if (
          !currentPlayer ||
          (challengeRoles.length > 0 && !currentPlayer.hasRoles(challengeRoles))
        ) {
          return null
        }
      }
      return (
        <Route
          key={`${path}-${index}`}
          exact
          path={path}
          component={component}
        />
      )
    }
  )
  routesToReturn.push(<Route exact key="not-found" component={NotFound} />)
  return <Switch>{routesToReturn}</Switch>
}
