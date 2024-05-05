import { NOTIFICATION_TYPES } from "@maracuja/shared/constants"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { Notification } from "@maracuja/shared/models"
import moment from "moment"
import React, { Children, useEffect, useState } from "react"
import Tab from "react-materialize/lib/Tab"
import Tabs from "react-materialize/lib/Tabs"
import { Link } from "react-router-dom"

export default () => {
  const { currentChallenge } = useCurrentChallenge()
  const [motivationHistory, setMotivationHistory] = useState<any>(null)
  const [wakeUpHistory, setWakeUpHistory] = useState<any>(null)

  useEffect(() => {
    const unsub2 = loadWakeUpHistory()
    const unsub3 = loadMotivationHistory()
    return () => {
      unsub2 && unsub2()
      unsub3 && unsub3()
    }
  }, [])

  const loadMotivationHistory = () => {
    return Notification.fetchAll(
      { challengeId: currentChallenge.id },
      {
        refHook: (ref) =>
          ref.where("type", "==", NOTIFICATION_TYPES.MOTIVATE_TEAM).orderBy("createdAt", "desc").limit(15),
        listener: (notifs) => {
          notifs && setMotivationHistory(notifs)
        },
      }
    )
  }

  const loadWakeUpHistory = () => {
    return Notification.fetchAll(
      { challengeId: currentChallenge.id },
      {
        refHook: (ref) =>
          ref.where("type", "==", NOTIFICATION_TYPES.WAKEUP_PLAYER).orderBy("createdAt", "desc").limit(15),
        listener: (notifs) => notifs && setWakeUpHistory(notifs),
      }
    )
  }

  return (
    <div>
      <h2>Envoyé par les {currentChallenge.wording?.captains}</h2>
      <Tabs>
        <Tab title="Messages personnalisés">
          <ul>
            {motivationHistory?.map((notification) => {
              return <NotificationPreview notification={notification} key={notification.id} />
            })}
          </ul>
        </Tab>
        <Tab title="Notifications aux joueurs endormis">
          <ul>
            {wakeUpHistory?.map((notification) => {
              return <NotificationPreview notification={notification} key={notification.id} />
            })}
          </ul>
        </Tab>
      </Tabs>
    </div>
  )
}

const NotificationPreview = ({ notification }) => {
  const { currentChallenge } = useCurrentChallenge()

  return (
    <li style={{ borderBottom: "1px solid black" }}>
      {notification.from && (
        <p>
          Envoyé par{" "}
          <Link to={`/challenges/${currentChallenge.id}/players/${notification.from?.id}`} target="_blank">
            {notification.from?.username}
          </Link>
          {notification.team && (
            <>
              {" "}
              -{" "}
              <Link to={`/challenges/${currentChallenge.id}/teams/${notification.team.id}`} target="_blank">
                {notification.team.name}
              </Link>
            </>
          )}
        </p>
      )}
      <p>{moment(notification.createdAt).format("le DD MMM YYYY à H:mm:ss")}</p>
      <h5>{notification.template?.title}</h5>
      <p>{notification.template?.message}</p>
      <p>{JSON.stringify(notification.stats)}</p>
      <br />
    </li>
  )
}
