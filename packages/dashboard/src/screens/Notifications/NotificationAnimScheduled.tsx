import {
  NOTIFICATION_AUDIENCES,
  NOTIFICATION_STATUS,
  NOTIFICATION_TEMPLATE_TYPES,
  NOTIFICATION_TYPES,
  USER_ROLES,
} from "@maracuja/shared/constants"
import { useAuthUser, useCurrentChallenge } from "@maracuja/shared/contexts"
import { Notification } from "@maracuja/shared/models"
import moment from "moment"
import React, { Children, useEffect, useState } from "react"
import { generatePath, Link } from "react-router-dom"
import styled from "styled-components"
import { ROUTES } from "../../constants"

export default () => {
  const { currentChallenge, currentQuestionSets } = useCurrentChallenge()
  const [animationHistory, setAnimationHistory] = useState<any>([])

  useEffect(() => {
    const unsub1 = loadScheduledAnimation()
    return () => {
      unsub1 && unsub1()
    }
  }, [])

  const loadScheduledAnimation = () => {
    return Notification.fetchAll(
      {
        challengeId: currentChallenge.id,
      },
      {
        refHook: (ref) =>
          ref
            .where("type", "==", NOTIFICATION_TYPES.ANIMATION)
            .where("status", "==", NOTIFICATION_STATUS.SCHEDULED)
            .orderBy("scheduledDate", "asc"),
        listener: (notifs) => {
          setAnimationHistory(notifs)
        },
      }
    )
  }

  return (
    <div>
      <h3>Programmées</h3>
      <Link to={generatePath(ROUTES.CHALLENGE_NOTIFICATIONS_HISTORY, { challengeId: currentChallenge.id })}>
        Passées
      </Link>

      <ul>
        {animationHistory &&
          Children.toArray(
            animationHistory.map((notification) => {
              return <NotificationPreview notification={notification} key={notification.id} />
            })
          )}
      </ul>
    </div>
  )
}

const NotificationPreview = ({ notification }) => {
  const { currentChallenge } = useCurrentChallenge()
  const { authUser } = useAuthUser()

  return (
    <NotificationWrapper
      className={`row ${notification.generatedNotification && "orange lighten-4"}`}
      status={notification.status}
    >
      <div className="col s12 m10 l10">
        <strong>
          {notification.template.type === NOTIFICATION_TEMPLATE_TYPES.EMAIL ? `📧 Un email ` : `🔔 Une notification `}
          sera envoyée le {moment(notification.scheduledDate).format("DD MMM YYYY à H:mm:ss")}{" "}
        </strong>
        <h5>{notification.template?.title}</h5>
        <p>{notification.template?.message}</p>
        <p>
          Audience : <strong>{notification.audience}</strong>
          {notification.audience === NOTIFICATION_AUDIENCES.TEAMS && ` (${notification.teamIds.join(",")})`}
          {notification.audience === NOTIFICATION_AUDIENCES.ASLEEP}
          {notification.audience === NOTIFICATION_AUDIENCES.ALREADY_PLAYED}
          {notification.template.type === NOTIFICATION_TEMPLATE_TYPES.EMAIL &&
            ` (email : ${notification.template.emailId})`}
        </p>
        {notification.questionSetId && <p>👉 {currentChallenge.questionSets?.[notification.questionSetId]?.name}</p>}
      </div>
      <div className="col s12 m2 l2">
        {authUser.hasRole(USER_ROLES.SUPER_ADMIN) && (
          <Link
            to={generatePath(ROUTES.CHALLENGE_NOTIFICATION, {
              notificationId: notification.id,
              challengeId: currentChallenge.id,
            })}
            className="btn red darken-3"
          >
            Modifier
          </Link>
        )}
      </div>
    </NotificationWrapper>
  )
}

const NotificationWrapper = styled.li<{ status: string }>`
  padding: 16px;
  background: ${(props) => (props.status === NOTIFICATION_STATUS.SENT ? "#E9F5FF" : "#EAEAEA")};
  border-bottom: "1px solid black";
`
