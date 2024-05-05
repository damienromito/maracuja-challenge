
const functions = require('firebase-functions').region('europe-west1')
const admin = require('firebase-admin')
const { calculRankingsInCurrentChallenges } = require('../../utils/rankings')

const { debug, info, error, warn } = require('firebase-functions/lib/logger')

// const runtimeOpts = {
//   timeoutSeconds: 300,
//   memory: '128MB'
// }
// functions.runWith(runtimeOpts).pubsub

exports = module.exports = functions.pubsub.schedule('* * * * *')
  .timeZone('Europe/Paris')
  .onRun(async (context) => {
    try {
      await calculRankingsInCurrentChallenges()
    } catch (err) {
      error('Error getting calculRankingsInCurrentChallenges', err)
    }
  })
