const { ACTIVITY_TYPES, NOTIFICATION_AUDIENCES, NOTIFICATION_TYPES } = require("../../../../constants")

const getCaptainNotification = ({ challengeId, questionSetId, questionSet, delay }) => {
  const scheduledDate = questionSet.startDate.toDate()
  scheduledDate.setHours(scheduledDate.getHours() + delay)

  if (scheduledDate < new Date()) return false
  let title, message
  if (questionSet.type === ACTIVITY_TYPES.CONTEST) {
    title = `Réveille tes joueurs ! `
    message = `En tant que capitaine, tu as le pouvoir de réveiller tes coéquipiers qui n'ont pas encore joué aujourd'hui ! Utilise le bouton "📣 Debout" à côté du nom de chaque joueur endormi ! `
  } else if (questionSet.type === ACTIVITY_TYPES.TRAINING) {
    title = `👋 Encourage tes joueurs !`
    message = `✊ Tes coéquipiers adorent recevoir un message de félicitations ! Utilise le bouton "✊motive ton équipe" pour leur envoyer un message personnalisé ! Un bon moyen de souder l'équipe durant ce challenge 🔥`
  }

  // CREATE NOTIFICATIOn
  const params = {
    scheduledDate,
    sendLater: true,
    challengeId,
    audience: NOTIFICATION_AUDIENCES.CAPTAINS,
    template: {
      challengeId,
      title,
      message,
      redirect: `/challenge/club`,
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
  getCaptainNotification,
}
