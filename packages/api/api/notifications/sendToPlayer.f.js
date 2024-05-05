const functions = require('firebase-functions').region('europe-west1')
const admin = require('firebase-admin')
const { debug, info, error, warn } = require('firebase-functions/lib/logger')
const { successResponse, errorResponse } = require('../../utils/response')
const { USER_ROLES } = require('../../constants')
const { authOnCall } = require('../../utils/functions')
const { Notification, NotificationTemplate, Player } = require('../../models')
const { getPlayersToNotify } = require('../../utils/players')

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  const { challengeId, template, playerId } = data
  template.challengeId = challengeId
  const players = await getPlayersToNotify({ challengeId, playerIds: [playerId] })
  if (!players?.length) {
    return errorResponse({ message: "L'utilisateur a probablement desactivé ses notifs" })
  }
  const notifTemplate = new NotificationTemplate(template)
  const notificationResponse = await Notification.sendNotificationToPlayers(players, notifTemplate)
  return successResponse({ stats: notificationResponse.stats })
})
