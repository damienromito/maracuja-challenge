const functions = require('firebase-functions').region('europe-west1')
const admin = require('firebase-admin')
const { getAction, isPropDirty } = require('../../../utils')

const { debug, info, error, warn } = require('firebase-functions/lib/logger')
const { Team } = require('../../../models')

const fieldValue = admin.firestore.FieldValue
exports = module.exports = functions.firestore
  .document('challenges/{challengeId}/whitelistMembers/{memberId}')
  .onWrite(async (change, context) => {
    const challengeId = context.params.challengeId
    const memberId = context.params.memberId
    const [action, oldDocument, newDocument] = getAction(change)

    if (action === 'update') {
      if (isPropDirty('clubId', oldDocument, newDocument) && oldDocument.clubId) {
        const newTeam = {}
        newTeam[`members.${memberId}`] = fieldValue.delete()
        await Team.update({ id: oldDocument.clubId, challengeId }, newTeam)
      }
    }

    return true
  })
