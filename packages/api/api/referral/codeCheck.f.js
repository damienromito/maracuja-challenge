const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const request = require("request")
const db = admin.firestore()

const { Player, Team } = require("../../models")

const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const errorCodes = require("../../constants/errorCodes")
const { objectSubset } = require("../../utils")
const { successResponse } = require("../../utils/response")
const { PLAYER_ROLES } = require("../../constants")
const { authOnCall } = require("../../utils/functions")

exports = module.exports = authOnCall(
  { auth: false },
  async (data, context) => {
    const { code, challengeId } = data

    const player = await Player.fetchByProperty({
      challengeId,
      propertyKey: "referralCode",
      propertyValue: code,
    })

    if (player) {
      const team = await Team.fetch({ challengeId, id: player.club.id })

      // hack TO AVOID Nan Values
      team.players = Object.keys(team.players).map((key) => {
        const player = team.players[key]
        delete player.scores
        return player
      })
      /// /

      return successResponse({
        team,
        player: {
          roles: [PLAYER_ROLES.REFEREE],
          referer: objectSubset(player, ["id", "firstName", "username"]),
        },
      })
    } else {
      return successResponse({
        exists: false,
        error: {
          message:
            "Ce code de parrainage n'existe pas. Respecte bien les minuscules et les majuscules.",
          code: errorCodes.NOT_EXISTS,
        },
      })
    }
  }
)
