const { debug, info, error, warn } = require("firebase-functions/lib/logger")

const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { QuestionSet } = require("../../../models")
const { NOTIFICATION_TYPES, NOTIFICATION_AUDIENCES } = require("../../../constants")

exports = module.exports = functions.firestore.document("challenges/{challengeId}/notifications/{notificationId}").onDelete(async (snap, context) => {
  const FieldValue = admin.firestore.FieldValue
  const challengeId = context.params.challengeId
  const notification = snap.data()
  if (notification.questionSetId) {
    const getNotificationKey = () => {
      switch (notification.audience) {
        case NOTIFICATION_AUDIENCES.ASLEEP:
          return "wakeUp"
        case NOTIFICATION_AUDIENCES.ALL:
          return "start"
        case NOTIFICATION_AUDIENCES.ALREADY_PLAYED:
          return "debriefing"
        case NOTIFICATION_AUDIENCES.CAPTAINS:
          return "captain"
      }
    }
    const notificationKey = getNotificationKey()

    const qs = await QuestionSet.fetch({
      challengeId,
      id: notification.questionSetId,
    })
    if (qs) {
      await QuestionSet.update(
        { challengeId, id: notification.questionSetId },
        {
          [`generatedNotifications.${notificationKey}.id`]: FieldValue.delete(),
          [`generatedNotifications.${notificationKey}.scheduledDate`]: FieldValue.delete(),
        }
      )
    }
  }
})
