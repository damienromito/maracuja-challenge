
const functions = require('firebase-functions').region('europe-west1')
const admin = require('firebase-admin')
const { nanoid } = require('nanoid')

const { errorResponse, successResponse } = require('../../utils/response')
const { debug, info, error, warn } = require('firebase-functions/lib/logger')
const { participateToActivity } = require('../../utils/activities')
const { objectSubset, stringToId } = require('../../utils')
const { authOnCall } = require('../../utils/functions')
const { Notification, NotificationTemplate, Player } = require('../../models')
const { getPlayer, getPlayers, getPlayersToNotify } = require('../../utils/players')
const db = admin.firestore()

exports = module.exports = authOnCall({ auth: true }, async (data, context) => {
  const { challenge, team, player, event } = data
  const now = admin.firestore.Timestamp.now()
  const challengeRef = db.collection('challenges').doc(challenge.id)
  const eventsRef = challengeRef.collection('eventsSubscriptions')

  const newEvent = {
    player,
    team,
    challenge,
    event,
    createdAt: now
  }

  const eventId = `${stringToId(player.username).substr(0, 12)}_${team.id.substr(0, 8)}_${event.id.substr(0, 8)}_${nanoid(4)}`
  await eventsRef.doc(eventId).set(newEvent)

  // const eventPreview = {
  //   ...objectSubset(event,['periodString']),
  //   createdAt : now
  // }

  await participateToActivity({
    activitiesTypeKey: 'events',
    activityId: event.id,
    challengeId: challenge.id,
    multipleParticipation: false,
    score: 2,
    phaseId: event.phaseId,
    playerId: player.id,
    teamId: team.id
  })

  const players = await getPlayersToNotify({ challengeId: challenge.id, playerIds: [player.id] })

  const template = new NotificationTemplate({
    emailOnly: true,
    title: `Merci ${player.username} pour ton inscription à l'atelier d'idéation !`,
    message: `📅 RDV le ${event.periodString}`,
    buttonText: 'Aller au challenge',
    analyticsLabel: 'subscribe-event',
    challengeId: challenge.id
  })

  const notificationResponse = await Notification.sendNotificationToPlayers(players, template)
  return successResponse({ stats: notificationResponse.stats })
})
