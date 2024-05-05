const functions = require("firebase-functions").region("europe-west1")

const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { Notification } = require("../models")

const runtime = {
  timeoutSeconds: 540,
  memory: "2GB",
}

exports = module.exports = functions
  .runWith(runtime)
  .pubsub.schedule("every 5 minutes")
  .timeZone("Europe/Paris")
  .onRun(async (context) => {
    console.log("Envoie des notifications")
    await Notification.sendScheduledNotifications()
  })
