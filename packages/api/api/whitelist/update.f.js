const admin = require("firebase-admin")
const { successResponse } = require("../../utils/response")
const { objectSubset } = require("../../utils")
const { debug } = require("firebase-functions/lib/logger")
const WhitelistMember = require("../../models/WhitelistMember")
const User = require("../../models/User")
const { Challenge, Team, Club } = require("../../models")
const { authOnCall } = require("../../utils/functions")
const { USER_ROLES, PLAYER_ROLES } = require("../../constants")
const { importMembersToWhitelist } = require("../../utils/whitelist")

const fieldValue = admin.firestore.FieldValue

exports = module.exports = authOnCall({ role: USER_ROLES.ADMIN }, async (data, context) => {
  const { challengeId, membersToUpdate } = data
  await importMembersToWhitelist({ challengeId, members: membersToUpdate })

  // const updatedMemberCountArray = await Promise.all(promises)

  // const updatedMembersCount = updatedMemberCountArray.reduce((a, b) => a + b, 0)

  return successResponse()
})

// const validateEmail = (email) => {
//   return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
// }
