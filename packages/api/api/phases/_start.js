const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { successResponse } = require("../../utils/response")
const { createPhaseRankings, getTeamRankingPreview } = require("../../utils/rankings")
const { objectSubset } = require("../../utils")
const { getChallenge } = require("../../utils/challenges")
const db = admin.firestore()

const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { authOnCall } = require("../../utils/functions")
const { USER_ROLES } = require("../../constants")
const { Team } = require("../../models")
const { displayTeamInRanking } = require("../../utils/rankings/create")
const { updatePhaseRankings } = require("../../utils/phases")

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  const { challengeId, phaseId, previousPhaseId } = data
  await updatePhaseRankings({ challengeId, phaseId, previousPhaseId })

  return successResponse()
})
