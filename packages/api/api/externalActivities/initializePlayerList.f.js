const admin = require("firebase-admin")
const { successResponse } = require("../../utils/response")

const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { ExternalActivity, Player } = require("../../models")
const { ACTIVITY_TYPES, ERROR_CODES, USER_ROLES } = require("../../constants")
const { syncSheetFromUrl } = require("../../utils/gSheet")
const FirebaseObject = require("../../models/FirebaseObject")
const { authOnCall } = require("../../utils/functions")

const headerValues = ["playerId", "teamId", "Equipe", "Nom", "Prenom", "Score"]
const db = admin.firestore()

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  const { challengeId, externalActivityId } = data

  const activity = await ExternalActivity.fetch({
    challengeId,
    id: externalActivityId,
  })

  const sheet = await syncSheetFromUrl(activity.spreadsheetUrl)

  const players = await Player.fetchAll({ challengeId })

  const playerLines = players
    .map((player) => {
      const line = {
        Equipe: player.club.name,
        playerId: player.id,
        teamId: player.club.id,
        Nom: player.lastName,
        Prenom: player.firstName || player.username,
        Score: "",
      }
      return line
    })
    .sort((a, b) => {
      let textA = a.Equipe
      let textB = b.Equipe
      return textA < textB ? -1 : textA > textB ? 1 : 0
    })

  await sheet.clear()
  await sheet.setHeaderRow(headerValues)
  await sheet.addRows(playerLines)

  return successResponse()
})
