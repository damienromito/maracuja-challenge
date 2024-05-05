import {
  NOTIFICATION_AUDIENCES,
  NOTIFICATION_STATUS,
  NOTIFICATION_TEMPLATE_TYPES,
  USER_ROLES,
} from "@maracuja/shared/constants"
import { useAuthUser, useCurrentChallenge } from "@maracuja/shared/contexts"
import { Notification } from "@maracuja/shared/models"
import moment from "moment"
import { nanoid } from "nanoid"
import React from "react"
import { generatePath, Link } from "react-router-dom"
import styled from "styled-components"
import { ROUTES } from "../../constants"

export default ({ notification }) => {
  const { currentChallenge } = useCurrentChallenge()
  const { authUser } = useAuthUser()
  const handleDuplicateNotif = async () => {
    if (window.confirm("La notification sera reprogrammée")) {
      const duplicatedNotif = {
        ...notification,
      }
      duplicatedNotif.sentAt = null
      duplicatedNotif.scheduledDate = null
      duplicatedNotif.status = NOTIFICATION_STATUS.SCHEDULED
      delete duplicatedNotif.generatedNotification
      delete duplicatedNotif.questionSetId
      await Notification.create(
        { challengeId: notification.challengeId, id: notification.id + nanoid(2) },
        duplicatedNotif
      )
    }
  }
  return (
    <NotificationWrapper className="row" status={notification.status}>
      <div className="col s12 m10 l10">
        {notification.status === NOTIFICATION_STATUS.SCHEDULED ? (
          <strong>🔔 Sera envoyée le {moment(notification.scheduledDate).format("DD MMM YYYY à H:mm:ss")} </strong>
        ) : (
          <strong>
            {notification.template.type === NOTIFICATION_TEMPLATE_TYPES.EMAIL ? `📧 Email ` : `🔔 Notification `}
            envoyée le {moment(notification.sentAt).format("DD MMM YYYY à H:mm:ss")}{" "}
          </strong>
        )}
        <h5>{notification.template?.title}</h5>
        <p>{notification.template?.message}</p>
        <p>
          Audience : <strong>{notification.audience}</strong>
          {notification.audience === NOTIFICATION_AUDIENCES.TEAMS && ` (${notification.teamIds.join(",")})`}
          {notification.audience === NOTIFICATION_AUDIENCES.ASLEEP && ` (${notification.questionSetId})`}
        </p>
      </div>
      <div className="col s12 m2 l2">
        {notification.status === NOTIFICATION_STATUS.SCHEDULED ? (
          authUser.hasRole(USER_ROLES.SUPER_ADMIN) ? (
            <Link
              to={generatePath(ROUTES.CHALLENGE_NOTIFICATION, {
                notificationId: notification.id,
                challengeId: currentChallenge.id,
              })}
              className="btn red darken-3"
            >
              Modifier
            </Link>
          ) : null
        ) : (
          <>
            {notification.status === NOTIFICATION_STATUS.SENT && (
              <strong>✅ Envoyée à {notification.stats.totalDelivery} joueurs </strong>
            )}
            <p>Push : {notification.stats.pushDelivery}</p>
            <p>Email : {notification.stats.emailDelivery}</p>
          </>
        )}
        {authUser.hasRole(USER_ROLES.SUPER_ADMIN) && (
          <button onClick={handleDuplicateNotif} className="btn red darken-3">
            Dupliquer
          </button>
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
