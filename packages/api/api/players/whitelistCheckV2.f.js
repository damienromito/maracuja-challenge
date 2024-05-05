const { errorResponse, successResponse } = require("../../utils/response")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")

const ERROR_CODES = require("../../constants/errorCodes")
const Team = require("../../models/Team")
const WhitelistMember = require("../../models/WhitelistMember")
const { authOnCall } = require("../../utils/functions")
const { MARACUJA_CLUB_ID } = require("../../constants")
const { Ranking } = require("../../models")

exports = module.exports = authOnCall({ auth: false }, async (data, context) => {
  let { email, challengeId } = data
  debug("data:", data)
  email = email.trim().toLowerCase()

  const whitelistMember = await WhitelistMember.fetchByEmail({ challengeId, email })
  if (!whitelistMember) {
    info(email + " not exists in whitelist")
    return errorResponse({
      code: ERROR_CODES.NOT_EXISTS,
      message: "Cette adresse email n'a pas accès au challenge. Si tu penses qu'il s'agit d'une erreur, clique sur \"j'ai besoin d'aide\" pour nous contacter.",
    })
  }

  let teamId = whitelistMember.clubId
  debug("teamId:", teamId)
  if (!teamId) {
    teamId = await getSmallestTeamId({ challengeId })
  }
  const team = await Team.fetch({ challengeId, id: teamId })
  if (!team) {
    return errorResponse({ message: "La team devrait exister" })
  }

  if (team.players?.[whitelistMember.id]) {
    return successResponse({
      error: {
        code: ERROR_CODES.ALREADY_EXISTS,
        message: "Tu es déjà inscrit.e. Connecte-toi.",
      },
    })
  }

  //buildForApi
  whitelistMember.createdAt = whitelistMember.createdAt.toDate().toISOString()

  return successResponse({
    team,
    member: whitelistMember,
  })
})

const getSmallestTeamId = async ({ challengeId }) => {
  const smallerTeams = await Team.fetchAll(
    { challengeId },
    {
      refHook: (ref) => ref.orderBy("playerCount", "asc").limit(2),
    }
  )

  if (smallerTeams[0].id === MARACUJA_CLUB_ID) return smallerTeams[1].id
  return smallerTeams[0].id
}

// const getSmallestTeamId = async ({ challengeId }) => {
//   const smallerTeams = await Team.fetchFirst(
//     { challengeId },
//     {
//       refHook: (ref) =>
//         ref
//           .where(admin.firestore.FieldPath.documentId(), "!=", MARACUJA_CLUB_ID)
//           .orderBy("playerCount", "asc")
//           .limit(1),
//     }
//   )

//   return smallerTeams.id
// }
