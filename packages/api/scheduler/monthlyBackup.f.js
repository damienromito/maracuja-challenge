const functions = require("firebase-functions").region("europe-west1")
const backup = require("../utils/backup")

//https://cloud.google.com/scheduler/docs/configuring/cron-job-schedules

//every day (but sunday) at 2am
exports = module.exports = functions.pubsub.schedule("0 2 1 * *").onRun(async () => {
  return backup(".montly")
})
