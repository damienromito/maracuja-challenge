import { NOTIFICATION_STATUS } from "@maracuja/shared/constants"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { Notification } from "@maracuja/shared/models"
import React, { Children, useEffect, useState } from "react"
import { generatePath, Link } from "react-router-dom"
import { ROUTES } from "../../constants"
import AnimationItem from "./AnimationItem"

export default () => {
  const { currentChallenge } = useCurrentChallenge()
  const [animationHistory, setAnimationHistory] = useState<any>([])

  useEffect(() => {
    const unsub1 = loadAnimationHistory()
    return () => {
      unsub1 && unsub1()
    }
  }, [])

  const loadAnimationHistory = () => {
    return Notification.fetchAll(
      {
        challengeId: currentChallenge.id,
      },
      {
        refHook: (ref) =>
          ref
            .where("type", "==", "animation")
            .where("status", "==", NOTIFICATION_STATUS.SENT)
            .orderBy("sentAt", "desc"),
        listener: (notifs) => {
          setAnimationHistory(notifs)
        },
      }
    )
  }

  return (
    <div>
      <h3>Historique</h3>
      <Link to={generatePath(ROUTES.CHALLENGE_NOTIFICATIONS, { challengeId: currentChallenge.id })}>A venir</Link>

      <ul>
        {animationHistory &&
          Children.toArray(
            animationHistory.map((notification) => {
              return <AnimationItem notification={notification} key={notification.id} />
            })
          )}
      </ul>
    </div>
  )
}
