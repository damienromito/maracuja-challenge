const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { authOnCall } = require("../../utils/functions")
const { USER_ROLES, PLAYER_ROLES } = require("../../constants")
const { Notification, Challenge, Player, ChallengeSettings } = require("../../models")
const { successResponse } = require("../../utils/response")
const fs = require("fs")
const WhitelistMember = require("../../models/WhitelistMember")
const { fetchChallengeEmailVariables } = require("../../utils/notifications/email")
const admin = require("firebase-admin")

const timestamp = admin.firestore.Timestamp

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  const { challengeId, emailTemplateType } = data
  debug("data:", data)

  const variables = await fetchChallengeEmailVariables(challengeId)

  if (emailTemplateType === "subscription") {
    const title = 'Aquitel x 4xSécurité : C\'est parti pour la première mi-temps de la formation "Sauveteur Secouriste Travail" 🔥'
    const members = await WhitelistMember.fetchByAudience({ challengeId, audience: "all" })
    const htmlContent = fs.readFileSync("./data/emails/subscription.html", "utf-8")
    const userPropertiesKeys = ["firstName"]
    // const response = await Notification.sendEmail({ users: members, challengeId, templateId: '', htmlContent, userPropertiesKeys, title, variables })
  } else if (emailTemplateType === "subscriptionFollowUp") {
    const title = "Aquitel x 4xSécurité : Le challenge a déjà commencé 😎"
    const members = await WhitelistMember.fetchByAudience({ challengeId, audience: "notSubscribed" })
    const htmlContent = fs.readFileSync("./data/emails/subscriptionFollowUp.html", "utf-8")
    const userPropertiesKeys = ["firstName"]
    // await Notification.sendEmail({ users: false, challengeId, templateId: '', htmlContent, userPropertiesKeys, title, variables })
  } else if (emailTemplateType === "captainBriefing") {
    const title = `${variables.challengeName} : Tes missions de capitaine ! `
    // const members = await WhitelistMember.fetchByAudience({ challengeId, audience: 'captains' })
    const captains = await Player.fetchAll(
      { challengeId },
      {
        refHook: (ref) => ref.where("roles", "array-contains", PLAYER_ROLES.CAPTAIN),
      }
    )


    const htmlContent = fs.readFileSync("./data/emails/captainBriefing.html", "utf-8")
    const userPropertiesKeys = ["firstName"]
    // const response = await Notification.sendEmail({ users: captains, challengeId, templateId: "", htmlContent, userPropertiesKeys, title, variables })

    await ChallengeSettings.update({ challengeId, id: "general" }, { "captainBriefing.lastSendAt": timestamp.now() })
  }

  return successResponse()
})
