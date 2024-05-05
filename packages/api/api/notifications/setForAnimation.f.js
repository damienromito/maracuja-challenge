const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { successResponse } = require("../../utils/response")
const { USER_ROLES, NOTIFICATION_TYPES } = require("../../constants")
const { authOnCall } = require("../../utils/functions")
const { Notification } = require("../../models")
const { objectSubset } = require("../../utils")

const runtime = {
  timeoutSeconds: 540,
  memory: "2GB",
}

exports = module.exports = authOnCall({ roles: USER_ROLES.SUPER_ADMIN, runtime }, async (data, context) => {
  const params = objectSubset(data, ["scheduledDate", "sendLater", "challengeId", "audience", "playerIds", "template", "teamIds", "questionSetId", "questionSetPhaseId", "questionSetType", "phaseId", "mailingListEnabled"])

  params.type = NOTIFICATION_TYPES.ANIMATION
  params.scheduledDate = new Date(params.scheduledDate)
  params.template.challengeId = data.challengeId
  let notification
  if (data.id) {
    notification = await Notification.update({ challengeId: data.challengeId, id: data.id }, params, true)
  } else {
    notification = await Notification.createForAnimation(params)
  }

  if (!data.sendLater) {
    const notificationResponse = await notification.send()
    return successResponse({ stats: notificationResponse.stats })
  } else {
    return successResponse()
  }
})
