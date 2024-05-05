
const admin = require('firebase-admin')
const { debug, info, error, warn } = require('firebase-functions/lib/logger')
const { errorResponse, successResponse } = require('../../utils/response')
const { Team, Player } = require('../../models')
const { objectSubset } = require('../../utils')
const { PLAYER_ROLES, USER_ROLES } = require('../../constants/')
const { authOnCall } = require('../../utils/functions')

const fieldValue = admin.firestore.FieldValue

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  const { playerId, newTeamId, challengeId } = data

  const player = await Player.fetch({ challengeId, id: playerId })
  if (!player) return errorResponse()

  const oldTeam = await Team.fetch({ challengeId, id: player.club.id })
  const newTeam = await Team.fetch({ challengeId, id: newTeamId })

  const playerUpdates = {
    club: objectSubset(newTeam, ['id', 'name']),
    clubId: newTeam.id,
    score: fieldValue.delete()
  }
  await player.update(playerUpdates)

  const newTeamUpdates = {}
  const oldTeamUpdates = {}

  if (oldTeam.members?.[player.id]) {
    newTeamUpdates[`members.${player.id}`] = oldTeam.members[player.id]
    oldTeamUpdates[`members.${player.id}`] = fieldValue.delete()
    // TODO update whitelist
  } else {
    newTeamUpdates.playerCount = fieldValue.increment(1)
    if (player.roles.includes(PLAYER_ROLES.CAPTAIN)) {
      newTeamUpdates.captainCount = fieldValue.increment(1)
      oldTeamUpdates.captainCount = fieldValue.increment(-1)
    }
    newTeamUpdates[`players.${player.id}`] = oldTeam.players[player.id]
    oldTeamUpdates.playerCount = fieldValue.increment(-1)
    oldTeamUpdates[`players.${player.id}`] = fieldValue.delete()
  }

  await newTeam.update(newTeamUpdates)
  await oldTeam.update(oldTeamUpdates)

  return successResponse()
})
