
const functions = require('firebase-functions').region('europe-west1')
const admin = require('firebase-admin')
const { successResponse } = require('../../utils/response')
const { generateId } = require('../../utils')
const { initMailjet, createMailjetList } = require('../../utils/emails/mailjet')
const { nanoid } = require('nanoid')
const db = admin.firestore()

const { debug, info, error, warn } = require('firebase-functions/lib/logger')
const { authOnCall } = require('../../utils/functions')
const { USER_ROLES } = require('../../constants')
const { Team, Club } = require('../../models')

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  const { name, organisationId, id, challengeId, fromExistingClub,currentPhaseId } = data

  if(fromExistingClub){
    let club
    try {
      club = await Club.fetch({id})
    } catch (error) {
      throw Error('No club found with id ' + id)
    }
    await Team.createFromClub(club, {challengeId,teamId : id, currentPhaseId})
  }else{

    await Team.createWithNewClub({ id, challengeId }, { name, organisationId })
  }

  return successResponse({ id: challengeId })
})
