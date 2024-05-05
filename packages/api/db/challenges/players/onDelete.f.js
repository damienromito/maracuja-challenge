const { debug, info, error, warn } = require("firebase-functions/lib/logger")

const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { WhitelistMember, ChallengeSettings } = require("../../../models")

exports = module.exports = functions.firestore.document("challenges/{challengeId}/players/{playerId}").onDelete(async (snap, context) => {
  const FieldValue = admin.firestore.FieldValue
  const db = admin.firestore()
  const challengeId = context.params.challengeId
  const playerId = context.params.playerId
  const player = snap.data()
  const teamId = player.clubId
  const stats = {}
  stats.playerCount = FieldValue.increment(-1)

  debug(`Will DELETE player in challenge "${challengeId}" / user :"${playerId}" in team "${teamId}" ! `)

  const userRef = db.collection("users").doc(playerId)
  const teamRef = db.collection("challenges").doc(challengeId).collection("teams").doc(teamId)
  const clubRef = db.collection("clubs").doc(teamId)

  // 1 - REMOVE PLAYER FROM TEAM
  const updateTeam = {}
  updateTeam[`players.${playerId}`] = FieldValue.delete()
  updateTeam[`members.${playerId}`] = FieldValue.delete()
  updateTeam.playerCount = FieldValue.increment(-1)

  if (player.referer) {
    updateTeam.refereeCount = FieldValue.increment(-1)
    stats.refereeCount = FieldValue.increment(-1)
    const refererRef = db.collection("challenges").doc(challengeId).collection("players").doc(player.referer.id)
    //TODO if referer not exists (has been deleted")
    const newReferer = {
      [`referees.${playerId}`]: FieldValue.delete(),
      refereeCount: FieldValue.increment(-1),
    }
    await refererRef.update(newReferer)
  }

  if (player.roles?.includes("CAPTAIN")) {
    updateTeam.captainCount = FieldValue.increment(-1)
    stats.captainCount = FieldValue.increment(-1)
  }

  // WHITELIST UPDATES
  if (player.createdAtInWhitelist) {
    const member = await WhitelistMember.fetch({ challengeId, id: playerId })
    if (member) {
      const memberUpdate = { subsribed: false }
      await member.update(memberUpdate)
    }
  }

  // REMOVE GAMES
  if (player.gameCount) {
    stats.gameCount = FieldValue.increment(-player.gameCount)
    updateTeam.gameCount = FieldValue.increment(-player.gameCount)
  }
  // TODO Remove score and update ranking and stats by questionssets and phases

  // UPDATE DB
  await teamRef.update({ ...updateTeam })

  const newClub = {}
  newClub[`members.${playerId}`] = FieldValue.delete()
  await clubRef.update(newClub)

  await ChallengeSettings.updateStats({ challengeId, teamId: player.club.id }, stats)

  // 2 - UNSUBSCRIBE USER TO CHALLENGE
  try {
    await userRef.update({ challengeIds: FieldValue.arrayRemove(challengeId) })
  } catch (error) {
    info(`L'utilisateur ${playerId} n'existe pas ou vient d'etre supprimé`)
  }
})
