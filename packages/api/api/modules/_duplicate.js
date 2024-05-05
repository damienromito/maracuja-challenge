const { successResponse } = require("../../utils/response")
const { generateId } = require("../../utils")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { authOnCall } = require("../../utils/functions")
const { USER_ROLES } = require("../../constants")
const { Module, Theme } = require("../../models")
const { nanoid } = require("nanoid")

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  const { moduleId, organisationIdFrom, organisationIdTo, newName } = data
  const module = await Module.fetch({
    organisationId: organisationIdFrom,
    id: moduleId,
  })

  const newModuleId = module.id + "_copy" + nanoid(4)
  const newModule = {
    name: newName,
    organisationId: organisationIdTo,
  }
  await Module.create({ organisationId: organisationIdTo, id: newModuleId }, newModule)

  const promises = []
  for (const themeId in module.themes) {
    const createPromise = createTheme({
      organisationIdTo,
      organisationIdFrom,
      themeId,
      newModuleId,
      newName,
    })
    promises.push(createPromise)
  }

  await Promise.all(promises)

  return successResponse({ id: moduleId })
})

const createTheme = async ({ organisationIdTo, organisationIdFrom, themeId, newModuleId, newName }) => {
  const theme = await Theme.fetch({
    organisationId: organisationIdFrom,
    id: themeId,
  })
  const newQuestions =
    theme.questions?.map((question) => {
      return {
        ...question,
        id: question.id + "_copy" + nanoid(2),
      }
    }) || []
  const newTheme = {
    name: theme.name,
    organisationId: organisationIdTo,
    module: {
      id: newModuleId,
      name: newName,
    },
    questions: newQuestions,
  }
  await Theme.create({ organisationId: organisationIdTo, id: themeId + "_copy" + nanoid(4) }, newTheme)
}
