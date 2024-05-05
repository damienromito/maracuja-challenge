
const { debug, info, error, warn } = require('firebase-functions/lib/logger')
const { USER_ROLES } = require('../../constants')
const { authOnCall } = require('../../utils/functions')
const { User } = require('../../models')

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  const { userId, challengeId, organisationId, role } = data

  await User.addRole({ userId, challengeId, role, organisationId })

  // const user = await userRef.get()
  // set role in organisation
  // const newOrgaRoles = {
  //   username : user.username,
  //   firstName : user.firstName,
  //   lastName : user.lastName,
  //   roles :
  // }
  // const userRef = db.collection('organisations').doc(organisationId).collection('authori')

  return { success: 'ok' }
})
