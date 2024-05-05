const functions = require('firebase-functions').region('europe-west1')
const admin = require('firebase-admin')
const { getAction, objectSubset } = require('../../../utils')

const { debug, info, error, warn } = require("firebase-functions/lib/logger")

const FieldValue = admin.firestore.FieldValue
const db = admin.firestore()
exports = module.exports = functions.firestore
  .document('challenges/{challengeId}/surveys/{activityId}')
  .onWrite((change, context) => {

    const challengeId = context.params.challengeId
    const activityId = context.params.activityId
    const [action, oldDocument, newDocument] = getAction(change)
      
    const activitiesType = 'surveys'
    let newActivity = {}
    const activitiesPath = `${activitiesType}.${activityId}`
    if(action === "delete"){
      newActivity[activitiesPath] = FieldValue.delete()
    } else {
      newActivity[activitiesPath] = newDocument
    }
    return db.collection("challenges").doc(challengeId).update(newActivity)
})

