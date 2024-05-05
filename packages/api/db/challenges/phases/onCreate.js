const functions = require('firebase-functions').region('europe-west1')
const admin = require('firebase-admin')
const { getAction} = require('../../../utils');

exports = module.exports = functions.firestore
.document('challenges/{challengeId}/phases/{phaseId}')
.onCreate((change, context) => {
  const db = admin.firestore()
  const challengeId = context.params.challengeId
  const phaseId = context.params.phaseId
  const [action, oldDocument, newDocument] = getAction(change)

  if (isPropDirty('ranking', oldDocument, newDocument) && newDocument.ranking ) {
    delete newDocument.ranking 
    let newPhase = {}
    newPhase[`phases.${phaseId}`] = {
      ...newDocument,
      id : phaseId,
    }
    debug(newPhase)
    return db.collection("challenges").doc(challengeId)
    .update(newPhase)
  }else{
    return true
  }
})


