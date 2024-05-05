const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { promiseBatchByChunks } = require("../")
const mailjetApiKey = MAILJET_API_KEY
const mailjetSecretKey = MAILJET_SECRET_KEY
const fs = require("fs")
const Challenge = require("../../models/Challenge")

const getEmailForTemplate = ({ email, subject, variables, name }) => {
  const mailjetEmail = {
    To: [
      {
        Email: email,
      },
    ],
    Subject: subject,
    Variables: variables,
  }
  if (name) {
    mailjetEmail.To[0].Name = name
  }

  return mailjetEmail
}

const buildEmail = ({ email, variables, content, campaignId, templateId }) => {
  const emailData = {
    To: [
      {
        Email: email,
      },
    ],
    Subject: variables.title,
    TemplateLanguage: true,
    Variables: {
      ...variables,
    },
  }
  if (campaignId) emailData.CustomCampaign = campaignId
  if (templateId) emailData.TemplateID = templateId
  else emailData.HTMLPart = content

  return emailData
}

const getEmailNotification = ({ email, title, subject, content, message, buttonText = "Ouvrir l'app", challengeImageUrl, challengeLink, challengePrimaryColor, challengeSecondaryColor }) => {
  return {
    To: [
      {
        Email: email,
      },
    ],
    Subject: subject || title,
    HTMLPart: content,
    TemplateLanguage: true,
    Variables: {
      title: title,
      message: message,
      challengeImageUrl: challengeImageUrl,
      challengeLink: challengeLink,
      buttonText: buttonText,
      challengePrimaryColor: challengePrimaryColor,
      challengeSecondaryColor: challengePrimaryColor,
    },
  }
}

// const createContact = async ( ) => {
//   const mailjet = require ('node-mailjet').connect(mailjetApiKey, mailjetSecretKey)
//   const request = mailjet.post("contact", {'version': 'v3'})
//     .request({
//         "IsExcludedFromCampaigns":"true",
//         "Name":"Dam Dim",
//         "Email":"passenger@mailjet.com"
//       })
//   request
//     .then((result) => {
//       console.log(result.body)
//     })
//     .catch((err) => {
//       console.log(err.statusCode)
//     })
// }

const fetchChallengeEmailVariables = async (challengeId, returnAll = false) => {
  const challenge = await Challenge.fetch({ id: challengeId })

  // if(challenge.trainingActions){
  //   const dates = challenge.trainingActions.dates
  //   if(dates.length)
  // }
  const result = {
    mailingListEnabled: challenge.emails?.mailingListEnabled,
    challengeImageUrl: challenge.image,
    challengeCode: challenge.code,
    challengeName: challenge.name,
    challengeLink: challenge.dynamicLink?.link,
    challengePrimaryColor: challenge.colors.primary,
    challengeSecondaryColor: challenge.colors.secondary,
    challengeTrainingActionsName: challenge.trainingActions?.name,
    challenge,
    // challengeTrainingActionsDates : challenge.trainingActions?.title,
  }
  if (returnAll) result.challenge = challenge
  return result
}

const sendEmailNotifications = async ({ emails, sandboxMode = false, campaignId, templateId, fromEmail }) => {
  if (!emails) emails = []
  info(`Preparing ${emails.length} email notifications`)

  // Doc : https://dev.mailjet.com/email/reference/send-emails/

  const mailjet = require("node-mailjet").connect(mailjetApiKey, mailjetSecretKey)

  const promises = promiseBatchByChunks(
    emails,
    (chunk) => {
      const emailData = {
        Globals: {
          From: {
            Email: fromEmail || "bonjour@maracuja.ac",
            Name: "L'équipe Maracuja",
          },
        },
        Messages: chunk,
        SandboxMode: sandboxMode,
        // "DeduplicateCampaign": true
      }

      if (campaignId) {
        emailData.Globals.CustomCampaign = campaignId
      }
      if (templateId) {
        emailData.Globals.TemplateID = templateId
        emailData.Globals.TemplateLanguage = true
      }

      return mailjet.post("send", { version: "v3.1" }).request(emailData)
    },
    50
  )

  const chunkResults = await Promise.all(promises)

  const successCount = chunkResults.reduce((total, result) => {
    return total + result.body.Messages.length
  }, 0)

  return successCount
}

module.exports = {
  getEmailNotification,
  sendEmailNotifications,
  getEmailForTemplate,
  buildEmail,
  fetchChallengeEmailVariables,
}
