/** *******WARNING*************/
// NE PAS EXPOSER EN PRODUCTION//
/** *******WARNING*************/

const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { USER_ROLES } = require("../constants")
const { authOnCall } = require("../utils/functions")
const { successResponse } = require("../utils/response")

exports = module.exports = authOnCall(
  { role: USER_ROLES.SUPER_ADMIN },
  async (data, context) => {
    const { userId } = data

    await admin.auth().setCustomUserClaims(userId, { roles: ["SUPER_ADMIN"] })
    return successResponse()
  }
)
