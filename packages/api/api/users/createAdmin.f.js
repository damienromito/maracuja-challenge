const { errorResponse, successResponse } = require("../../utils/response")
const { User } = require("../../models")
const { authOnCall } = require("../../utils/functions")
const { nanoid } = require("nanoid")
const { USER_ROLES } = require("../../constants")
const admin = require("firebase-admin")
const { sendEmailNotifications, buildEmail, fetchChallengeEmailVariables } = require("../../utils/notifications/email")
const { debug } = require("firebase-functions/logger")

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  let { email, challengeId, firstName, organisationId, role } = data

  email = email.trim().toLowerCase()

  const existingUser = await User.fetchByEmail({ email: email })

  const password = nanoid(8)
  let user
  if (!existingUser) {
    user = await User.createUserWithEmailAndPassword({
      email,
      password,
      username: firstName,
      firstName,
    })
  }

  await User.addRole({
    userId: existingUser?.id,
    challengeId,
    role: USER_ROLES.ADMIN,
    organisationId,
  })

  if (existingUser) return successResponse()

  const passwordLink = await admin.auth().generatePasswordResetLink(email, {
    url: "https://dashboard.maracuja.ac",
  })

  const variables = {
    email,
    firstName,
    title: "Bienvenue dans l'univers Maracuja " + firstName,
    passwordLink,
  }

  let templateId = 4116407

  if (role === USER_ROLES.AUTHOR) {
    templateId = 4116407
  } else {
    templateId = 3937922
    const challengeVariables = await fetchChallengeEmailVariables(challengeId, true)
    variables.challengeName = challengeVariables.challengeName
  }

  const emailContent = buildEmail({
    email,
    variables,
  })

  await sendEmailNotifications({
    emails: [emailContent],
    templateId,
  })

  return successResponse({ password, passwordLink, user: user || null })
})
