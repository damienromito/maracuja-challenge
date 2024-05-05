import { Capacitor } from "@capacitor/core"
import { objectSubset } from "@maracuja/shared/helpers"
import { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { Modal, Popup } from "../components"
import { NotificationContext, useCurrentChallenge } from "../contexts"

const PushNotificationManager = () => {
  const isPushNotificationsAvailable = Capacitor.isPluginAvailable("PushNotifications")
  const [activeNotification, setActiveNotification] = useState<any>(null)
  const { PushNotifications } = useContext(NotificationContext)
  const { currentChallenge, setCurrentChallengeById } = useCurrentChallenge()
  const history = useHistory()

  useEffect(() => {
    // NOTIFICATIONS
    if (!isPushNotificationsAvailable) return

    PushNotifications.removeAllDeliveredNotifications()
    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener("pushNotificationReceived", (data: any) => {
      const notif = objectSubset(data.data, ["body", "title", "redirect", "challengeId"])
      setActiveNotification(notif)
    })

    // Method called when tapping on a notification
    PushNotifications.addListener("pushNotificationActionPerformed", (data: any) => {
      const notif = objectSubset(data.notification.data, ["body", "redirect", "title", "challengeId"])
      setActiveNotification(notif)
    })
  }, [])

  const handleNotifRedirection = () => {
    if (activeNotification.challengeId && currentChallenge.id !== activeNotification.challengeId) {
      setCurrentChallengeById(activeNotification.challengeId)
    }
    if (activeNotification.redirect) {
      history.push(activeNotification.redirect)
    }
  }

  return (
    <>
      {activeNotification && (
        <Modal
          isOpen={activeNotification != null}
          onClose={() => setActiveNotification(null)}
          title={activeNotification.title}
          validTextButton="OK"
          validActionButton={handleNotifRedirection}
        >
          {activeNotification.body}
        </Modal>
      )}
    </>
  )
}

export { PushNotificationManager }
