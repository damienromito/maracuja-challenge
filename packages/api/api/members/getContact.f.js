const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { errorResponse, successResponse } = require("../../utils/response")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")

const ROLES = require("../../constants/roles")
const ERROR_CODES = require("../../constants/errorCodes")
const Team = require("../../models/Team")
const WhitelistMember = require("../../models/WhitelistMember")
const { authOnCall } = require("../../utils/functions")

exports = module.exports = authOnCall({ auth: true }, async (data, context) => {
  const { memberId, challengeId } = data

  const whitelistMember = await WhitelistMember.fetch({ challengeId, id: memberId })

  return successResponse({
    email: whitelistMember.email,
  })
})
