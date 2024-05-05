const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { successResponse } = require("../../utils/response")

const { authOnCall } = require("../../utils/functions")

const { addCaptainToTeam, removeCaptainToTeam } = require("../../utils/teams/captains")

exports = module.exports = authOnCall({ auth: true }, async (data, context) => {
  const { playerId, challengeId, teamId, removeRole } = data
  // GET PLAYER
  if (removeRole) {
    await removeCaptainToTeam({ playerId, challengeId, teamId })
  } else {
    await addCaptainToTeam({ playerId, challengeId, teamId })
  }

  return successResponse({
    isCaptain: true,
  })
})
