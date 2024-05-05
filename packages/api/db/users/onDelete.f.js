const { debug, info, error, warn } = require('firebase-functions/lib/logger')

const functions = require('firebase-functions').region('europe-west1')
const admin = require('firebase-admin')

exports = module.exports = functions.firestore
  .document('users/{userId}')
  .onDelete((snap, context) => {
    const FieldValue = admin.firestore.FieldValue
    const db = admin.firestore()
    const user = snap.data()
    const userId = context.params.userId
    const batch = db.batch()

    debug('user deleted >', user)
    const stats = {}
    stats.userCount = FieldValue.increment(-1)
    batch.update(db.collection('stats').doc('global'), stats)

    console.log('user:', user)
    user.challengeIds?.forEach((challengeId) => {
      batch.delete(db.collection('challenges').doc(challengeId).collection('players').doc(userId))
    })

    return batch.commit()
      .then(() => {
        debug(`${userId}" deleted ! `)

        return admin.auth().getUser(userId).then(user => {
          info('will delete auth user' + userId, user)
          return admin.auth().deleteUser(userId)
        }).catch(err => {
          debug('Error', err)
          return true
        })
      })
  })
