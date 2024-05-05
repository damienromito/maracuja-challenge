const functions = require("firebase-functions").region("europe-west1")
const backup = require("../utils/backup")

//https://cloud.google.com/scheduler/docs/configuring/cron-job-schedules
//every sunday at 2AM
exports = module.exports = functions.pubsub.schedule("0 2 * * 7").onRun(async () => {
  return backup(".weekly")
})
