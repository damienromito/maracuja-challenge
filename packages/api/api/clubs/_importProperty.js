
const functions = require('firebase-functions').region('europe-west1')
const admin = require('firebase-admin')
const { generateId, trimAndLowerCase } = require('../../utils');
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const db = admin.firestore()


const { loadFileRows, syncSheetFromUrl } = require('../../utils/gSheet');
const { successResponse, errorResponse } = require('../../utils/response');

 
const timestamp = admin.firestore.Timestamp
 
exports = module.exports = functions.https.onCall(async (data, context) => {
  const timestampNow = timestamp.now()
  const {spreadSheetUrl, clubPropertyId, clubPropertyName,  fields} = data

  const sheet = await syncSheetFromUrl(spreadSheetUrl)
  const rows = await sheet.getRows() 
  const propertyValues = rows.map(row => {
    const propertyValue = {} 
    fields.forEach(field => {
      if(row[field]){
        propertyValue[field] = row[field]
      }
    })
    return propertyValue 
  })
  const newProperty = {
    name : clubPropertyName,
    values : propertyValues,
    createdAt : timestamp.now()
  }
  const propertyRef = db.collection("clubProperties").doc(clubPropertyId)
  await propertyRef.set(newProperty)
  return successResponse()
})

