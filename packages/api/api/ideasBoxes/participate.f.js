const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { nanoid } = require("nanoid")

const { errorResponse, successResponse } = require("../../utils/response")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { participateToActivity } = require("../../utils/activities")
const { objectSubset, stringToId } = require("../../utils")
const { authOnCall } = require("../../utils/functions")
const { Notification, NotificationTemplate, Player, Idea, ChallengeSettings } = require("../../models")
const { getPlayersToNotify } = require("../../utils/players")
const { MARACUJA_CLUB_ID } = require("../../constants")
const db = admin.firestore()
const FieldValue = admin.firestore.FieldValue

exports = module.exports = authOnCall({ auth: true }, async (data, context) => {
  const { challenge, team, player, ideasBox, idea, captainIds } = data
  const now = admin.firestore.Timestamp.now()
  const challengeRef = db.collection("challenges").doc(challenge.id)
  const ideasRef = challengeRef.collection("ideas")

  const playerObject = await Player.fetch({ challengeId: challenge.id, id: player.id })
  const playerPayload = objectSubset(playerObject, ["id", "username", "firstName", "lastName"])
  playerPayload.avatar = playerObject.getAvatar()

  const newIdea = {
    idea,
    player: playerPayload,
    team,
    challengeId: challenge.id,
    challenge,
    ideasBox,
    createdAt: now,
  }

  const ideaId = `${stringToId(player.username).substr(0, 12)}_${team.id.substr(0, 8)}_${ideasBox.id.substr(0, 8)}_${nanoid(4)}`

  await Idea.create({ id: ideaId, challengeId: challenge.id }, newIdea)

  await participateToActivity({
    activitiesTypeKey: "ideasBoxes",
    activityId: ideasBox.id,
    challengeId: challenge.id,
    multipleParticipation: true,
    score: 1,
    phaseId: ideasBox.phaseId,
    playerId: player.id,
    teamId: team.id,
  })

  const stats = {
    ideaCount: FieldValue.increment(1),
    [`${ideasBox.phaseId}.ideasBoxes.count`]: FieldValue.increment(1),
    [`ideasBoxes.${ideasBox.id}.count`]: FieldValue.increment(1),
  }

  await ChallengeSettings.updateStats({ challengeId: challenge.id, teamId: team.id }, stats)

  // return successResponse()

  // SEND EMAIL TO PLAYER

  const template = new NotificationTemplate({
    emailOnly: true,
    title: `Merci ${player.username} pour ton idée ! 💡`,
    message: `Tu viens de déposer une idée ou une problèmatique : «${idea}»`,
    buttonText: "Ajouter une autre idée",
    challengeId: challenge.id,
  })

  const players = await getPlayersToNotify({
    challengeId: challenge.id,
    playerIds: [player.id],
  })
  const notificationResponse = await Notification.sendNotificationToPlayers(players, template)
  return successResponse({ stats: notificationResponse.stats })
})
