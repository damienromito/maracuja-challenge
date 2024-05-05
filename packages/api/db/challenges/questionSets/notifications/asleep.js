const { ACTIVITY_TYPES, NOTIFICATION_AUDIENCES, NOTIFICATION_TYPES } = require("../../../../constants")

const getAsleepNotification = ({ challengeId, questionSetId, questionSet, delay }) => {
  const scheduledDate = questionSet.endDate.toDate()
  scheduledDate.setHours(scheduledDate.getHours() + delay)

  if (scheduledDate < new Date()) return false
  let title, message
  if (questionSet.type === ACTIVITY_TYPES.CONTEST) {
    title = `H${delay} ⏰ fin de l'épreuve du jour`
    message = "Tu n'as pas encore joué et l'épreuve se termine bientôt ! Go 🔥 "
  } else if (questionSet.type === ACTIVITY_TYPES.TRAINING) {
    title = `H${delay} ⏰ fin de l'entrainement du jour`
    message = "Tu n'as pas encore joué et l'entrainement se termine bientôt ! Go 💪 "
  }

  // CREATE NOTIFICATIOn
  const params = {
    scheduledDate,
    sendLater: true,
    challengeId,
    audience: NOTIFICATION_AUDIENCES.ASLEEP,
    template: {
      challengeId,
      title,
      message,
      redirect: `/`,
      // redirect: `/${questionSet.type}s/${questionSetId}/intro`,
    },
    type: NOTIFICATION_TYPES.ANIMATION,
    questionSetId: questionSetId,
    questionSetPhaseId: questionSet.phase.id,
    questionSetType: questionSet.type,
    phaseId: questionSet.phase.id,
    generatedNotification: true,
  }
  return params
}

module.exports = {
  getAsleepNotification,
}
