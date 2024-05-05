// ENVOYER A DES TOKENS UNIQUEMENT https://firebase.google.com/docs/cloud-messaging/send-message#send-messages-to-multiple-devices

const admin = require("firebase-admin")
const { promiseBatchByChunks } = require("../")

const { debug, info, error, warn } = require("firebase-functions/lib/logger")

const getPushNotification = ({ token, title, message, analyticsLabel = "nc", redirect = "/", challengeId }) => {
  const notification = {
    token: token,
    notification: {
      title: title,
      body: message,
    },
    data: {
      redirect: redirect,
      title: title,
      body: message,
    },
    android: {
      ttl: 3600 * 1000,
      notification: {
        icon: "stock_ticker_update",
        color: "#f45342",
      },
    },
    apns: {
      payload: {
        aps: {
          badge: 1,
        },
      },
    },
    fcmOptions: {
      analyticsLabel: analyticsLabel,
    },
  }

  if (challengeId) {
    notification.data.challengeId = challengeId
  }
  return notification
}

const sendPushNotification = (notification) => {
  return admin.messaging().send(notification)
}

const sendPushNotifications = async (notifications, sandboxMode) => {
  info(`Preparing ${notifications.length} push notifications`)
  if (sandboxMode) return { successCount: notifications.length }

  const disabledTokens = []
  const promises = promiseBatchByChunks(
    notifications,
    (chunk, index) => {
      debug(`Chunk ${index} of ${chunk.length} notifications`)
      return admin
        .messaging()
        .sendAll(chunk)
        .then((result) => {
          result.responses.forEach((response, index) => {
            if (!response.success) {
              if (response.error.errorInfo.code === "messaging/registration-token-not-registered") {
                disabledTokens.push(chunk[index].token)
              } else {
                debug("OTHER ERROR", response.error)
              }
            }
          })
          return result
        })
    },
    500
  )

  info(`Send ${notifications.length} notifications in ${promises.length} parts`)

  // //Doc : https://firebase.google.com/docs/reference/admin/node/admin.messaging.BatchResponse
  const chunkResults = await Promise.all(promises)

  const successCount = chunkResults.reduce((total, result) => {
    return total + result.successCount
  }, 0)
  return {
    successCount,
    disabledTokens,
  }
}

module.exports = {
  getPushNotification,
  sendPushNotification,
  sendPushNotifications,
}
