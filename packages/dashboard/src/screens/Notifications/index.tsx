import { USER_ROLES } from "@maracuja/shared/constants"
import { useAuthUser, useCurrentChallenge } from "@maracuja/shared/contexts"
import "firebase/firestore"
import React from "react"
import { generatePath, Link, useLocation } from "react-router-dom"
import { ROUTES } from "../../constants"
import AnimationListHistory from "./NotificationAnimHistory"
import AnimationList from "./NotificationAnimScheduled"

export default () => {
  const { currentChallenge } = useCurrentChallenge()
  const { authUser } = useAuthUser()

  const location = useLocation<any>()
  const searchParams = new URLSearchParams(location.search)

  return (
    <div>
      <h1>Notifications</h1>
      {authUser.hasRole(USER_ROLES.SUPER_ADMIN) && (
        <>
          <Link
            to={generatePath(ROUTES.CHALLENGE_NOTIFICATION_NEW, {
              notificationId: null,
              challengeId: currentChallenge.id,
            })}
            className="btn red darken-4"
          >
            Nouvelle notification
          </Link>
          &nbsp;
        </>
      )}

      {searchParams.get("filter") === "history" ? <AnimationListHistory /> : <AnimationList />}
    </div>
  )
}
