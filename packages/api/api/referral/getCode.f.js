const { customAlphabet } = require("nanoid")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { Player } = require("../../models")
const { successResponse } = require("../../utils/response")
const { authOnCall } = require("../../utils/functions")

exports = module.exports = authOnCall({ auth: true }, async (data, context) => {
  const { challengeId } = data

  // const nanoid = customAlphabet("1234567890abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ", 4)
  const nanoid = customAlphabet("1234567890ABCDEFGHJKLMNPQRSTUVWXYZ", 5)
  const referralCode = nanoid()
  await Player.update({ challengeId, id: context.auth.uid }, { referralCode })

  return successResponse({
    referralCode,
  })
})
