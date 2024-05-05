const admin = require("firebase-admin")
const { debug } = require("firebase-functions/lib/logger")
const { errorResponse } = require("./response")
const functions = require("firebase-functions")
const { ERROR_CODES, USER_ROLES } = require("../constants")

const authOnCall = ({ auth, role, runtime }, resolve) => {
  let builder = functions.region("europe-west1")
  if (runtime) builder = builder.runWith(runtime)
  return builder.https.onCall(async (data, context) => {
    if (auth && !context.auth?.uid) return errorResponse({ error: ERROR_CODES.NOT_AUTHORIZED, message: "pas authorisé" })
    if (role && !context.auth?.token?.roles?.includes(USER_ROLES.SUPER_ADMIN) && !context.auth?.token?.roles?.includes(role)) {
      debug("L'utilisateur n'a pas les droits pour acceder à la fonction")
      return errorResponse({ error: ERROR_CODES.NOT_AUTHORIZED, message: "pas authorisé" })
    }
    return await resolve(data, context)
  })
}

module.exports = {
  authOnCall,
}
