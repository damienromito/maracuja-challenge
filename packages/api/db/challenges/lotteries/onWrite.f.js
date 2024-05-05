const functions = require('firebase-functions').region('europe-west1')
const admin = require('firebase-admin')
const { getAction, objectFromChangeProps } = require('../../../utils')

const { debug, info, error, warn } = require('firebase-functions/lib/logger')

const FieldValue = admin.firestore.FieldValue
const db = admin.firestore()
exports = module.exports = functions.firestore
  .document('challenges/{challengeId}/lotteries/{activityId}')
  .onWrite((change, context) => {
    const challengeId = context.params.challengeId
    const activityId = context.params.activityId
    const [action, oldDocument, newDocument] = getAction(change)

    const activitiesType = 'lotteries'
    let newLottery = {}
    const activitiesPath = `${activitiesType}.${activityId}`
    if (action === 'delete') {
      newLottery[activitiesPath] = FieldValue.delete()
    } else {
      newLottery = objectFromChangeProps({
        change,
        prefix: activitiesPath,
        props: [
          'name',
          'endDate',
          'startDate',
          'name',
          'phaseId',
          'type',
          'drawDate',
          'prizesInfo'
        ]
      })
    }
    if (Object.keys(newLottery).length > 0) {
      return db.collection('challenges').doc(challengeId).update(newLottery)
    } else {
      return false
    }
  })
