const functions = require("firebase-functions").region("europe-west1")
const { errorResponse, successResponse } = require("../../utils/response")
const { User } = require("../../models")
const { objectSubset } = require("../../utils")
const { authOnCall } = require("../../utils/functions")

exports = module.exports = authOnCall({ auth: false }, async (data, context) => {
  let { email, password, userId, username } = data
  // if (!userId) {
  //   userId = User.generateId(username)
  // }

  try {
    const user = await User.createUserWithEmailAndPassword({ email, password, username, id: userId || null })
    return successResponse({ user })
  } catch (error) {
    return errorResponse(objectSubset(error, ["error", "message", "code"]))
  }
})
