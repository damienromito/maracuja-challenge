const { ACTIVITY_TYPES, NOTIFICATION_AUDIENCES, NOTIFICATION_TYPES } = require("../../../../constants")

const getDebriefingNotification = ({ challengeId, questionSetId, questionSet, delay }) => {
  const scheduledDate = questionSet.endDate.toDate()
  scheduledDate.setHours(scheduledDate.getHours() + delay)

  if (scheduledDate < new Date()) return false
  const title = "📣 Ton débriefing est disponible"
  const message = "👉 Revois tes erreurs ! Cela te permet, au calme 😌 de bien préparer la future épreuve 👊"

  // CREATE NOTIFICATION
  const params = {
    scheduledDate,
    sendLater: true,
    challengeId,
    audience: NOTIFICATION_AUDIENCES.ALREADY_PLAYED,
    template: {
      challengeId,
      title,
      message,
      redirect: `/`,
      // redirect: `/${questionSet.type}s/${questionSetId}/intro`,
    },
    type: NOTIFICATION_TYPES.ANIMATION,
    questionSetId: questionSetId,
    generatedNotification: true,
    questionSetPhaseId: questionSet.phase.id,
    questionSetType: questionSet.type,
  }
  return params
}

module.exports = {
  getDebriefingNotification,
}
