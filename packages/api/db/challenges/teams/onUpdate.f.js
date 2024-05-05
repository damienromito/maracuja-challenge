const { debug, info, error, warn } = require("firebase-functions/lib/logger")

const functions = require('firebase-functions').region('europe-west1')
const admin = require('firebase-admin')
const { updateFromChangeProps} = require('../../../utils');

exports = module.exports = functions.firestore
  .document('challenges/{challengeId}/teams/{teamId}')
  .onUpdate(async (change, context) => {
    const db = admin.firestore()
    const clubId = context.params.teamId
   
    ///UPDATE USER
    const clubRef = db.collection('clubs').doc(clubId)
    return updateFromChangeProps(clubRef, change, [
      // 'image', 
      'logo',
      'name',
      'colors'
    ])

  })