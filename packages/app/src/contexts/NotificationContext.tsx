import { FCM } from "@capacitor-community/fcm"
import { objectSubset } from "@maracuja/shared/helpers"
import { Player } from "@maracuja/shared/models"
import moment from "moment"
import { createContext, useContext, useEffect, useState } from "react"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { useDevice } from "./DeviceContext"
import { PushNotifications } from "@capacitor/push-notifications"

const NotificationContextProvider = (props: any) => {
  const [fcmToken, setFcmToken] = useState<any>(null)
  const { platform, deviceId } = useDevice()
  const { currentChallenge, currentQuestionSet, currentPlayer } = useCurrentChallenge()

  useEffect(() => {
    if (currentPlayer && fcmToken && platform) {
      if (
        (currentPlayer.fcmToken !== fcmToken || currentPlayer.acceptNotification === false) &&
        (!currentPlayer.fcmToken || currentPlayer?.editedAt < moment().subtract(1, "hours"))
      ) {
        currentPlayer.update({
          acceptNotification: true,
          fcmToken,
          platform,
          deviceId,
        })
      }
    }
  }, [currentPlayer, fcmToken])

  const requestPushPermission = async () => {
    if (!platform) return
    if (platform === "ios") {
      const permission = await PushNotifications.requestPermissions()
      if (permission.receive === "granted") {
        PushNotifications.register()
      }
    } else if (platform === "android") {
      PushNotifications.register()
    } else {
      // web
      return
    }
    initPushNotifications()
  }

  const initPushNotifications = () => {
    PushNotifications.addListener("registration", (token) => {
      if (!fcmToken) {
        if (platform === "ios") {
          FCM.getToken().then((r) => {
            setFcmToken(r.token)
            console.log("r.token:", r.token)
          })
        } else if (platform === "android") {
          setFcmToken(token.value)
        }
      }
    })

    // Some issue with our setup and push will not work
    PushNotifications.addListener("registrationError", (error) => {
      console.log("Push Notification error :", error)
    })
  }

  const sendWakeUp = async ({ focusedPlayer, fromReferer }: any) => {
    const data = {
      playerId: focusedPlayer.id,
      questionSetId: currentQuestionSet.id,
      questionSetType: currentQuestionSet.type,
      challengeId: currentChallenge.id,
      phase: objectSubset(currentQuestionSet.phase, ["id", "type"]),
      captainWording: !fromReferer ? currentChallenge.wording.captain : currentChallenge.wording.referer,
      sender: objectSubset(currentPlayer, ["id", "username"]),
      mailingListEnabled: currentChallenge.emails.mailingListEnabled,
    }
    return await Player.wakeUp(data)
  }

  return (
    <NotificationContext.Provider
      value={{
        fcmToken,
        PushNotifications,
        platform,
        requestPushPermission,
        sendWakeUp,
      }}
    >
      {props.children}
    </NotificationContext.Provider>
  )
}
const NotificationContext = createContext<any>(undefined)
const useNotification = () => useContext(NotificationContext)

export { useNotification, NotificationContext, NotificationContextProvider }
