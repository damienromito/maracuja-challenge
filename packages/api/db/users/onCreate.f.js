const functions = require('firebase-functions').region('europe-west1')
const admin = require('firebase-admin')

const { debug, info, error, warn } = require("firebase-functions/lib/logger")


exports = module.exports = functions.firestore
  .document('users/{userId}')
  .onCreate((snap, context) => {
    const FieldValue = admin.firestore.FieldValue
    const db = admin.firestore()
    const userId = context.params.userId
    let batch = db.batch()

    let stats = {}
    stats['userCount'] = FieldValue.increment(1)
    batch.update(db.collection('stats').doc('global'), stats)


    return batch.commit()
      .then(() => {
        console.log(`${userId}" added ! `)
        return true
      })
      .catch(err => {
        debug(err)
      })

  })

  



    // .then(() => {
    //   return db.collection('challenges').doc(challengeId).get()
    //   .then(snap => {
    //     console.log("challenges =",JSON.stringify(snap.data(), null, 2))
    //   })
    // })
