/** *******WARNING*************/
// NE PAS EXPOSER EN PRODUCTION//
/** *******WARNING*************/

const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { USER_ROLES } = require("../constants")
const { Player, WhitelistMember } = require("../models")
const { authOnCall } = require("../utils/functions")
const { sendEmailNotifications, buildEmail } = require("../utils/notifications/email")
const { successResponse } = require("../utils/response")

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  const { challengeId, mailejtTemplateId, campaignId, title, test } = data
  let players
  if (test) {
    players = [
      {
        email: "damien@maracuja.ac",
        firstName: "Daminou",
      },
    ]
  } else {
    players = await WhitelistMember.fetchAll({ challengeId })
  }

  const emailsContent = players.map((player) => {
    return buildEmail({ email: player.email, variables: { title }, templateId: mailejtTemplateId })
  })
  await sendEmailNotifications({ emails: emailsContent, campaignId, templateId: mailejtTemplateId })

  return successResponse()
})
