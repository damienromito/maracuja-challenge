const admin = require("firebase-admin")
const { ACTIVITY_TYPES, ERROR_CODES, USER_ROLES } = require("../../constants")
const { ExternalActivity } = require("../../models")
const { authOnCall } = require("../../utils/functions")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { successResponse } = require("../../utils/response")
const { participateToActivity } = require("../../utils/activities")
const { syncSheetFromUrl } = require("../../utils/gSheet")

exports = module.exports = authOnCall(
  { role: USER_ROLES.SUPER_ADMIN },
  async (data, context) => {
    const { challengeId, externalActivityId } = data

    const activity = await new ExternalActivity({
      challengeId,
      id: externalActivityId,
    }).fetch()

    //recupere le fichier gsheet
    const sheet = await syncSheetFromUrl(activity.spreadsheetUrl)
    const rows = await sheet.getRows()

    const promises = []
    rows.forEach((line) => {
      if (!line.Score) return
      const promise = participateToActivity({
        activitiesTypeKey: "externalActivities",
        activityId: activity.id,
        challengeId: activity.challengeId,
        phaseId: activity.phaseId,
        multipleParticipation: false,
        playerId: line.playerId,
        teamId: line.teamId,
        score: Number(line.Score),
      })
      promises.push(promise)
    })

    const result = await Promise.all(promises)

    return successResponse({
      message: `les participations de ${result.length} joueurs ont été enregistrées`,
    })
  }
)
