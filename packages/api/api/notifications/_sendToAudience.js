const functions = require('firebase-functions').region('europe-west1')
const admin = require('firebase-admin')
const { debug, info, error, warn } = require('firebase-functions/lib/logger')
const { successResponse } = require('../../utils/response')
const { USER_ROLES } = require('../../constants')
const { authOnCall } = require('../../utils/functions')
const { Notification } = require('../../models')

const runtime = {
  timeoutSeconds: 540,
  memory: '2GB'
}

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN, runtime }, async (data, context) => {
  debug('PARAMS ', data)

  const notificationOptions = {
    audience,
    challengeId,
    playerIds,
    template,
    teamIds,
    questionSetId,
    questionSetPhaseId,
    questionSetType,
    phaseId,
    mailingListEnabled
  } = data

  notificationOptions.type = 'animation'

  try {
    notificationData = await Notification.createForAnimation(notificationOptions)
  } catch (err) {
    error(err)
  }

  return successResponse(notificationData)
})
