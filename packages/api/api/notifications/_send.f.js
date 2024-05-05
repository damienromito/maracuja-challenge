const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { successResponse } = require("../../utils/response")
const { USER_ROLES } = require("../../constants")
const { authOnCall } = require("../../utils/functions")
const { Notification } = require("../../models")

const runtime = {
  timeoutSeconds: 540,
  memory: "2GB",
}

exports = module.exports = authOnCall({ role_: USER_ROLES.SUPER_ADMIN, runtime }, async (data, context) => {
  debug("PARAMS ", data)
  const { notificationId, challengeId } = data

  const stats = await Notification.send({ challengeId, id: notificationId })

  return successResponse(stats)
})
