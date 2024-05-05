const { successResponse } = require("../../utils/response")
const { generateId, objectSubset } = require("../../utils")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { authOnCall } = require("../../utils/functions")
const { USER_ROLES } = require("../../constants")
const { Module, Theme } = require("../../models")

exports = module.exports = authOnCall(
  { role: USER_ROLES.ADMIN },
  async (data, context) => {
    const { name, organisationId, moduleId } = data
    debug("data:", data)
    const module = await Module.fetch({ organisationId, id: moduleId })
    debug("module:", module)

    const themeId = `${generateId(name)}_${moduleId.substring(
      0,
      8
    )}_${organisationId.substring(0, 8)}`
    debug("themeId:", themeId)

    await Theme.create(
      { organisationId, id: themeId },
      {
        name,
        organisationId,
        module: objectSubset(module, ["id", "name"]),
      }
    )

    return successResponse({ id: moduleId })
  }
)
