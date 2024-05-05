const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")

const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { authOnCall } = require("../../utils/functions")
const { USER_ROLES } = require("../../constants")
const { Notification } = require("../../models")

exports = module.exports = authOnCall({}, async (data, context) => {
  try {
    await Notification.sendScheduledNotifications()
  } catch (err) {
    error("Error getting notificationsSendScheduled", err)
  }
})
