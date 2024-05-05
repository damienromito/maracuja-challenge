const { Organisation, Challenge } = require("../../models")
const { authOnCall } = require("../../utils/functions")
const { USER_ROLES } = require("../../constants")
const WhitelistMember = require("../../models/WhitelistMember")
const { successResponse } = require("../../utils/response")

const accountSid = API_KEY
const authToken = AUTH_TOKEN

//Hello Damien, l'application a été mise à jour pour t'accueillir pour ce challenge qui va commencer ! Découvre ta future entreprise et tes futurs collègues dès maintenant. RDV ici https://maracuja.page.link/Q9oF et entre le code WELCOME2608 pour rejoindre ton équipe !
//Hello Damien, tes futurs collègue découvrent Aquitel sur l'application, rejoins-les dès maintenant ! RDV ici https://maracuja.page.link/Q9oF et entre le code WELCOME2608 pour rejoindre ton équipe !
//Hello Damien, le challenge pour découvrir Aquitel continue sur l'application Maracuja ! Lance l'application et retrouve tes collègues > https://maracuja.page.link/Q9oF
// taille sms https://twiliodeved.github.io/message-segment-calculator/
// test https://console.twilio.com/us1/develop/sms/try-it-out/send-an-sms?frameUrl=%2Fconsole%2Fsms%2Fgetting-started%2Fbuild%3Fx-target-region%3Dus1
exports = module.exports = authOnCall({ role: USER_ROLES.ADMIN }, async (data, context) => {
  const { challengeId, retry, testMembers } = data

  let members
  if (testMembers) {
    members = testMembers
  } else {
    members = await WhitelistMember.fetchAll(
      { challengeId },
      {
        refHook: (ref) =>
          ref
            .where(retry ? "subscriptionSmsRetrySent" : "subscriptionSmsSent", "==", false)
            .where("subscribed", "==", false),
      }
    )
  }

  // const members = [{
  //   firstName: 'Antony',
  //   phoneNumber: '+33782030016'
  // }]
  // const members = [{
  //   firstName: 'Vincent',
  //   phoneNumber: '+33659918794'
  // }]
  // const members = [{
  //   firstName: 'Damien',
  //   phoneNumber: '+33631499857'
  // }]

  const challenge = await Challenge.fetch({ id: challengeId })
  const organisation = await Organisation.fetch({
    id: challenge.organisationsIds[0],
  })

  const organisationName = organisation.name
  const challengeCode = challenge.code
  const challengeLink = challenge.dynamicLink?.link
  const messageContent = `${challenge.onboarding.subscriptionSms[retry ? "messageRetry" : "message"]
    } RDV ici ${challengeLink} pour télécharger l'app et entre le code ${challengeCode} pour rejoindre ton équipe !`

  const promises = members.map(async (member) => {
    if (!member.phoneNumber) return false
    return sendSMS({ member, messageContent, organisationName })
  })
  const result = await Promise.all(promises)

  if (!testMembers) {
    const promises2 = result.map(async (message) => {
      const m = members.find((m) => message.to === m.phoneNumber)
      const newMember = {
        [retry ? "subscriptionSmsRetrySent" : "subscriptionSmsSent"]: true,
      }
      return m?.update(newMember) || true
    })
    await Promise.all(promises2)
  }

  return successResponse()
})

const sendSMS = async ({ member, messageContent, organisationName }) => {
  const message = `Hello ${member.firstName}, ` + messageContent
  const client = require("twilio")(accountSid, authToken)
  return client.messages.create({
    body: message,
    from: "Maracuja",
    to: member.phoneNumber,
  })
}
