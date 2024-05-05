const admin = require("firebase-admin")
const db = admin.firestore()
const { Notification, QuestionSet } = require("../../../models")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { ACTIVITY_TYPES, NOTIFICATION_AUDIENCES, NOTIFICATION_TYPES, GENERATED_NOTIFICATION_TYPES } = require("../../../constants")
const { getAsleepNotification } = require("./notifications/asleep")
const { getCaptainNotification } = require("./notifications/captain")
const { getDebriefingNotification } = require("./notifications/debriefing")
const { getStartNotification } = require("./notifications/start")

const fieldValue = admin.firestore.FieldValue
//❌ attention de modifier egalement le dbChallengesNotificationsOnDelete lorsque vous ajoutez/modifiez une notification

const manageGeneratedNotifications = async ({ challengeId, questionSetId, questionSet }) => {
  //TODO get challenge to detect position of quiz (Premier , dernier, ..)

  if ([ACTIVITY_TYPES.TRAINING, ACTIVITY_TYPES.CONTEST].includes(questionSet.type)) {
    let questionSetUpdate = {}
    // QUIZ DISPONIBLE
    if (questionSet.type !== questionSet.isOnboarding) {
      const notificationStart = getStartNotification({ challengeId, questionSetId, questionSet, delay: questionSet.generatedNotifications?.[GENERATED_NOTIFICATION_TYPES.START]?.delay || 1 })
      const updateWithStartNotif = await updateNotification({ challengeId, questionSetId, notification: notificationStart, questionSet, notificationKey: GENERATED_NOTIFICATION_TYPES.START })
      questionSetUpdate = { ...updateWithStartNotif }
    }

    // CAPITAINES
    if (questionSet.type !== questionSet.isOnboarding) {
      const notificationCaptain = getCaptainNotification({ challengeId, questionSetId, questionSet, delay: questionSet.generatedNotifications?.[GENERATED_NOTIFICATION_TYPES.CAPTAIN]?.delay || 6 })
      const updateWithCaptainNotif = await updateNotification({ challengeId, questionSetId, notification: notificationCaptain, questionSet, notificationKey: GENERATED_NOTIFICATION_TYPES.CAPTAIN })
      questionSetUpdate = { ...questionSetUpdate, ...updateWithCaptainNotif }
    }

    // JOUEURS ENDORMIS
    const notificationAsleep = getAsleepNotification({ challengeId, questionSetId, questionSet, delay: questionSet.generatedNotifications?.[GENERATED_NOTIFICATION_TYPES.WAKE_UP]?.delay || -4 })
    const updateWithAsleepNotif = await updateNotification({ challengeId, questionSetId, notification: notificationAsleep, questionSet, notificationKey: GENERATED_NOTIFICATION_TYPES.WAKE_UP })
    questionSetUpdate = { ...questionSetUpdate, ...updateWithAsleepNotif }

    // DEBRIEFING
    if (questionSet.type === ACTIVITY_TYPES.CONTEST && !questionSet.isFinal) {
      const notificationDebriefing = getDebriefingNotification({ challengeId, questionSetId, questionSet, delay: questionSet.generatedNotifications?.[GENERATED_NOTIFICATION_TYPES.DEBRIEFING]?.delay || 9 })
      const updateWithDebrefingNotif = await updateNotification({ challengeId, questionSetId, notification: notificationDebriefing, questionSet, notificationKey: GENERATED_NOTIFICATION_TYPES.DEBRIEFING })
      questionSetUpdate = { ...questionSetUpdate, ...updateWithDebrefingNotif }
    }

    if (Object.keys(questionSetUpdate).length) {
      await QuestionSet.update({ challengeId, id: questionSetId }, questionSetUpdate)
    }
  }
  return true
}

const updateNotification = async ({ notification, challengeId, questionSetId, questionSet, notificationKey }) => {
  if (!questionSet.generatedNotifications) questionSet.generatedNotifications = {}
  if (!questionSet.generatedNotifications[notificationKey]) {
    questionSet.generatedNotifications[notificationKey] = {}
  }
  const qsNotifId = questionSet.generatedNotifications?.[notificationKey]?.id

  if (notification) {
    if (!qsNotifId) {
      const stats = await Notification.createForAnimation(notification)

      questionSet.generatedNotifications[notificationKey].id = stats.id
      return {
        ["generatedNotifications." + notificationKey + ".id"]: stats.id,
        ["generatedNotifications." + notificationKey + ".scheduledDate"]: notification.scheduledDate,
      }
    }

    await Notification.update({ challengeId, id: qsNotifId }, notification)
    return {
      ["generatedNotifications." + notificationKey + ".scheduledDate"]: notification.scheduledDate,
    }
  } else if (qsNotifId) {
    await Notification.delete({ challengeId, id: qsNotifId })
    delete questionSet.generatedNotifications[notificationKey]
    await {
      ["generatedNotifications." + notificationKey + ".id"]: fieldValue.delete(),
      ["generatedNotifications." + notificationKey + ".scheduledDate"]: fieldValue.delete(),
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const reloadChallengeNotifications = async ({ challengeId }) => {
  const ref = db.collection("challenges").doc(challengeId).collection("notifications")
  await db.recursiveDelete(ref)

  await sleep(10000)
  const questionSetsRef = db.collection("challenges").doc(challengeId).collection("questionSets")

  const questionsSetsSnaps = await questionSetsRef.where("type", "!=", ACTIVITY_TYPES.ICEBREAKER).get()

  // const questionSet = questionsSetsSnaps.docs[0]

  const promises = questionsSetsSnaps.docs.map((questionSet) => {
    console.log("questionSet:", questionSet.id)
    return manageGeneratedNotifications({
      questionSet: questionSet.data(),
      challengeId,
      questionSetId: questionSet.id,
    })
  })

  return Promise.all(promises)
}
module.exports = {
  manageGeneratedNotifications,
  reloadChallengeNotifications,
}
