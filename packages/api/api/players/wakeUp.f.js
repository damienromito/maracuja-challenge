const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { errorResponse, successResponse } = require("../../utils/response")
const { getPlayer } = require("../../utils/players")
const moment = require("moment")

const { objectSubset } = require("../../utils")
const { authOnCall } = require("../../utils/functions")
const { Notification, NotificationTemplate, Team, Player, ChallengeSettings } = require("../../models")
const { ACTIVITY_TYPES, NOTIFICATION_TYPES } = require("../../constants")
const FieldValue = admin.firestore.FieldValue
exports = module.exports = authOnCall({ auth: true }, async (data, context) => {
  const { playerId, questionSetId, questionSetType, challengeId, sender, phase, captainWording } = data
  const now = admin.firestore.Timestamp.now()

  // GET PLAYER
  const player = await Player.fetch({ challengeId, id: playerId })
  const teamId = player.club.id
  let message = `Hello ${player.username}, `
  if (questionSetType === ACTIVITY_TYPES.TRAINING) {
    message += "tu ne t'es pas encore entrainé.e aujourd'hui et la compétition commence bientôt ✊🏻"
  } else {
    message += "tu n'as pas encore joué aujourd'hui ! On a besoin de toi pour monter au classement ✊🏻"
  }

  // SEND NOTIFICATION
  const template = new NotificationTemplate({
    title: `Message de ton ${captainWording} ${sender.username}`,
    message,
    buttonText: "C'est parti",
    redirect: "/",
    challengeId,
  })
  const notificationResponse = await Notification.sendNotificationToPlayers([player], template)

  // UPDATE TEAM
  const newTeam = {
    [`players.${playerId}.scores.${phase.id}.${questionSetType}s.${questionSetId}.wokeUpAt`]: now,
  }
  await Team.update({ challengeId, id: teamId }, newTeam)

  // CEATE NOTIFICATION
  const notificationData = {
    type: NOTIFICATION_TYPES.WAKEUP_PLAYER,
    challengeId,
    to: objectSubset(player, ["id", "username"]),
    from: sender ? objectSubset(sender, ["id", "username", "clubId"]) : null,
    template: { ...template },
    stats: notificationResponse.stats,
  }
  const id = `${NOTIFICATION_TYPES.WAKEUP_PLAYER}_${player.clubId.substr(0, 12)}_${playerId.substr(0, 8)}_${moment().format("YYYY-MM-DD_H-mm")}`
  await Notification.create({ challengeId, id }, notificationData, true)

  const stats = {
    [`captains.notifications.wakeUpCount`]: FieldValue.increment(1),
  }
  await ChallengeSettings.updateStats({ challengeId, teamId }, stats)

  return successResponse({ stats: notificationResponse.stats })
})
