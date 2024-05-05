const { ACTIVITY_TYPES, NOTIFICATION_AUDIENCES, NOTIFICATION_TYPES } = require("../../../../constants")

const getStartNotification = ({ challengeId, questionSetId, questionSet, delay }) => {
  const scheduledDate = questionSet.startDate.toDate()
  scheduledDate.setHours(scheduledDate.getHours() + delay)

  if (scheduledDate < new Date()) return false
  let title, message
  if (questionSet.type === ACTIVITY_TYPES.CONTEST) {
    title = "📣 L'épreuve du jour a commencé !"
    message = `Participe à l'épreuve du jour et gagne des points pour ton équipe 🔥 ${questionSet.duration} secondes pour répondre à un max de questions`
  } else if (questionSet.type === ACTIVITY_TYPES.TRAINING) {
    title = "💪 Nouvel entrainement disponible !"
    message = `${questionSet.name} est disponible 🔥 3 min pour en apprendre plus ! Go go go`
  }

  // CREATE NOTIFICATIOn
  const params = {
    scheduledDate,
    sendLater: true,
    challengeId,
    audience: NOTIFICATION_AUDIENCES.ALL,
    template: {
      challengeId,
      title,
      message,
      redirect: `/`,
      // redirect: `/${questionSet.type}s/${questionSetId}/intro`,
    },
    type: NOTIFICATION_TYPES.ANIMATION,
    phaseId: questionSet.phase.id,
    questionSetId: questionSetId,
    generatedNotification: true,
  }
  return params
}

module.exports = {
  getStartNotification,
}
