const functions = require('firebase-functions').region('europe-west1')
const admin = require('firebase-admin')
const { objectSubset, getAction, isPropDirty } = require('../../../utils')
const { Module } = require('../../../models')
const { debug, info, error, warn } = require('firebase-functions/lib/logger')

const fieldValue = admin.firestore.FieldValue
const db = admin.firestore()

exports = module.exports = functions.firestore
  .document('organisations/{organisationId}/themes/{themeId}')
  .onWrite(async (change, context) => {
    const [action, oldDocument, newDocument] = getAction(change)

    const organisationId = context.params.organisationId
    const themeId = context.params.themeId

    // DELETE
    if (action === 'delete') {
      const updatedModule = {}
      updatedModule[`themes.${themeId}`] = fieldValue.delete()
      await Module.update({ organisationId, id: oldDocument.module.id }, updatedModule)
      return
    }

    // CREATE OR UPDATE

    // MODULE
    const updatedModule = {}
    if (isPropDirty('questions', oldDocument, newDocument)) {
      updatedModule[`themes.${themeId}.questionCount`] = newDocument.questions?.length || 0
    }
    if (isPropDirty('name', oldDocument, newDocument)) {
      updatedModule[`themes.${themeId}.name`] = newDocument.name
    }
    if (Object.keys(updatedModule).length) {
      await Module.update({ organisationId, id: newDocument.module.id }, updatedModule)
    }
  })
