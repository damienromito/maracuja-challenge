const { successResponse } = require("../../utils/response")
const { generateId } = require("../../utils")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { authOnCall } = require("../../utils/functions")
const { USER_ROLES } = require("../../constants")
const { Module } = require("../../models")

exports = module.exports = authOnCall({ role: USER_ROLES.ADMIN }, async (data, context) => {
  const { name, organisationId } = data
  const moduleId = `${generateId(name)}_${organisationId}`

  await Module.create({ organisationId, id: moduleId }, { name, organisationId })

  return successResponse({ id: moduleId })
})
