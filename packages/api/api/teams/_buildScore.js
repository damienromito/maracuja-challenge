const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { successResponse } = require("../../utils/response")
const { generateId } = require("../../utils")
const { initMailjet, createMailjetList } = require("../../utils/emails/mailjet")
const { nanoid } = require("nanoid")
const db = admin.firestore()

const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { authOnCall } = require("../../utils/functions")
const { USER_ROLES } = require("../../constants")
const { Team, Club, Challenge } = require("../../models")
const { getTeamScoresForPhase } = require("../../utils/rankings")

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  const { challengeId, teamId } = data
  const challenge = await Challenge.fetch({ id: challengeId })
  const team = await Team.fetch({ challengeId, id: teamId })
  const score = await getTeamScoresForPhase({ players: team.players, phaseId: challenge.getCurrentPhase().id, topPlayers: challenge.topPlayers })

  console.dir(score, { depth: null })

  return successResponse({ id: challengeId })
})
