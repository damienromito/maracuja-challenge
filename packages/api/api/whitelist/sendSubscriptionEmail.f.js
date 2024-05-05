const WhitelistMember = require("../../models/WhitelistMember")
const { Notification, Organisation } = require("../../models")
const { authOnCall } = require("../../utils/functions")
const { USER_ROLES } = require("../../constants")
const fs = require("fs")
const { fetchChallengeEmailVariables } = require("../../utils/notifications/email")
const { successResponse } = require("../../utils/response")
const { emailBuilder } = require("../../utils/emails/builder")

exports = module.exports = authOnCall({ role: USER_ROLES.ADMIN }, async (data, context) => {
  const { challengeId, retry, testMembers } = data
  let members

  if (testMembers) {
    members = testMembers
  } else {
    members = await WhitelistMember.fetchAll(
      { challengeId },
      {
        refHook: (ref) => ref.where(retry ? "subscriptionEmailRetrySent" : "subscriptionEmailSent", "!=", true).where("subscribed", "==", false),
      }
    )
  }

  // console.log('members:', members)
  const variables = await fetchChallengeEmailVariables(challengeId, true)
  const challenge = variables.challenge
  const organisation = await Organisation.fetch({ id: challenge.organisationsIds[0] })
  const organisationName = organisation.name

  variables.contentTitle = challenge.onboarding.subscriptionEmail[retry ? "titleRetry" : "title"]
  variables.introMessage = ""
  const title = `${organisationName} ${variables.challengeName} : ${variables.contentTitle}`
  // const htmlContent = fs.readFileSync("./data/emails/subscription.html", "utf-8")
  const layoutList = ["header"]
  if (challenge.webAppEnabled) {
    layoutList.push("challengeButtonMobile")
    layoutList.push("content")
    layoutList.push("challengeButtonWebApp")
  } else {
    layoutList.push("challengeButton")
    layoutList.push("content")
  }
  layoutList.push("footer")
  const htmlContent = emailBuilder({ folder: "subscription", layoutList })

  const userPropertiesKeys = ["firstName"]
  variables.contentIntroduction = challenge.onboarding.subscriptionEmail.introduction
  variables.contentDescription = challenge.onboarding.subscriptionEmail.description
  variables.contentPlanning = challenge.onboarding.subscriptionEmail.planning

  await Notification.sendEmail({ users: members, challengeId, htmlContent, userPropertiesKeys, title, variables })
  if (!testMembers) {
    const promises = members.map(async (member) => {
      return member.update({ [retry ? "subscriptionEmailRetrySent" : "subscriptionEmailSent"]: true })
    })
    await Promise.all(promises)
  }
  return successResponse()
})
