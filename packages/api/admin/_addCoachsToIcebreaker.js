/** *******WARNING*************/
// NE PAS EXPOSER EN PRODUCTION//
/** *******WARNING*************/

const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { object } = require("firebase-functions/v1/storage")
const { USER_ROLES } = require("../constants")
const { ChallengeSettings, Team } = require("../models")
const { authOnCall } = require("../utils/functions")
const { addQuestionToIcebreaker } = require("../utils/icebreaker")
const { successResponse } = require("../utils/response")

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  const { challengeId } = data

  const coachsObjects = await ChallengeSettings.fetch({ challengeId, id: "coachs" })

  let coach
  //TODO SEVERAL COACH
  Object.keys(coachsObjects).map((key) => {
    if (key === "id") return
    coach = coachsObjects[key]
    coach.id = key
  })

  const teams = await Team.fetchAll({ challengeId })
  const question = coach.icebreaker
  const promises = teams.map((team) => {
    return addQuestionToIcebreaker({ challengeId, teamId: team.id, question, playerId: coach.id })
  })

  await Promise.all(promises)

  return successResponse()
})
