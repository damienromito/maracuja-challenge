const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const admin = require("firebase-admin")
const { errorResponse, successResponse } = require("../../utils/response")
const { objectSubset } = require("../../utils")
const { authOnCall } = require("../../utils/functions")
const { Notification, NotificationTemplate, ChallengeSettings } = require("../../models")
const { NOTIFICATION_TYPES } = require("../../constants")
const { getPlayersByAudience } = require("../../utils/players")
const moment = require("moment")
const FieldValue = admin.firestore.FieldValue
exports = module.exports = authOnCall({ auth: true }, async (data, context) => {
  const db = admin.firestore()
  const now = admin.firestore.Timestamp.now()
  const { challenge, sender, captainWording, team, message } = data
  const teamId = team.id
  const challengeId = challenge.id
  const challengeRef = db.collection("challenges").doc(challenge.id)
  const teamRef = challengeRef.collection("teams").doc(teamId)
  // PREPARE NOTIFICATION

  // SEND NOTIFICATION

  const players = await getPlayersByAudience("teams", { challengeId, teamIds: [teamId] })

  const template = new NotificationTemplate({
    title: `Message de ton ${captainWording} ${sender.username}`,
    message,
    buttonText: "C'est parti !",
    challengeId,
  })

  const notificationResponse = await Notification.sendNotificationToPlayers(players, template)

  // UPDATE MOTIVATED AT ON CAPTAIN
  const newTeam = {}
  newTeam.motivatedAt = now
  await teamRef.update({ ...newTeam })
  sender.teamId = teamId

  // SAVE NOTIFICATION IN DB
  const params = {
    challengeId,
    template: objectSubset(template, ["title", "message"]),
    type: NOTIFICATION_TYPES.MOTIVATE_TEAM,
    team,
    from: objectSubset(sender, ["id", "username"]),
    stats: notificationResponse.stats,
  }
  const id = `${NOTIFICATION_TYPES.MOTIVATE_TEAM}_${teamId.substr(0, 12)}_${moment().format("YYYY-MM-DD_H-mm")}`

  await Notification.create({ challengeId, id }, params, true)

  const stats = {
    [`captains.notifications.motivateCount`]: FieldValue.increment(1),
  }
  await ChallengeSettings.updateStats({ challengeId, teamId }, stats)

  // await Notification.saveNotification(notification)

  return successResponse({ stats: notificationResponse.stats })
})
