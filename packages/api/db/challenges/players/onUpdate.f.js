const { debug, info, error, warn } = require('firebase-functions/lib/logger')

const functions = require('firebase-functions').region('europe-west1')
const admin = require('firebase-admin')
const { updateFromChangeProps } = require('../../../utils')

exports = module.exports = functions.firestore
  .document('challenges/{challengeId}/players/{playerId}')
  .onUpdate(async (change, context) => {
    const db = admin.firestore()
    const challengeId = context.params.challengeId
    const userId = context.params.playerId
    const clubId = change.after.data().clubId
    // const [action, oldDocument, newDocument] = getAction(change)

    // mail
    // if(!oldDocument.notifications?.email?.news && newDocument.notifications?.email?.news){

    //   await Player.subscribeToChallengeTips({challengeId : newDocument.challengeId, player : newDocument, mailjetListId : })
    // }

    /// UPDATE USER
    const userRef = db.collection('users').doc(userId)

    try {
      await updateFromChangeProps(userRef, change, [
        'firstName',
        'username',
        'phoneNumber',
        'lastName',
        'birthday',
        'email',
        'fcmToken',
        'platform',
        'avatar',
        'licenseNumber'
      ])
    } catch (err) {
      error('Error updateFromChangeProps', err)
    }

    // UPDATE TEAM
    const teamRef = db.collection('challenges').doc(challengeId).collection('teams').doc(clubId)

    try {
      await updateFromChangeProps(teamRef, change, [
        'firstName',
        'username',
        'avatar',
        'roles',
        'number',
        'acceptNotification',
        'refereeCount',
        'referer',
        'engagment'
      ], `players.${userId}`)
    } catch (err) {
      error('Error updateFromChangeProps', err)
    }

    return true
  })
