const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { successResponse } = require("../../utils/response")
const { generateId, objectSubset } = require("../../utils")
const { initMailjet, createMailjetList } = require("../../utils/emails/mailjet")
const { nanoid } = require("nanoid")
const db = admin.firestore()

const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { authOnCall } = require("../../utils/functions")
const { USER_ROLES } = require("../../constants")
const { Team, Club, Challenge, WhitelistMember } = require("../../models")
const { importMembersToWhitelist } = require("../../utils/whitelist")

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  const { challengeId, fromChallengeId, importWhitelist } = data

  if (importWhitelist) {
    //Import players from whitelist to white team
    const whitelistMembers = await WhitelistMember.fetchAll({ challengeId: fromChallengeId })
    const members = whitelistMembers.map((member) => {
      return {
        ...objectSubset(member, ["email", "firstName", "lastName", "username"]),
        team: member.clubId,
        action: "create",
      }
    })
    await importMembersToWhitelist({ challengeId, members })
  } else {
    //Import Teams from challenge
    await importTeamsFromOtherChallenge(challengeId, fromChallengeId)
  }

  return successResponse({ id: challengeId })
})

const importTeamsFromOtherChallenge = async (challengeId, fromChallengeId) => {
  const teams = await Team.fetchAll({ challengeId: fromChallengeId })

  const promises = teams.map((team) => {
    return Team.createFromClubId(team.id, { challengeId })
  })
  return Promise.all(promises)
}
