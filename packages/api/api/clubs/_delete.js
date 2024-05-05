const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { generateId, trimAndLowerCase, objectSubset } = require("../../utils")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const db = admin.firestore()
const { promiseBatchByChunks } = require("../../utils")

const { loadFileRows } = require("../../utils/gSheet")
const { successResponse, errorResponse } = require("../../utils/response")
const FirebaseObject = require("../../models/FirebaseObject")
const { authOnCall } = require("../../utils/functions")
const { USER_ROLES } = require("../../constants")
Array.prototype.forEachAsyncParallel = async function (fn) {
  await Promise.all(this.map(fn))
}
const timestamp = admin.firestore.Timestamp

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  const clubsRef = db.collection("clubs")

  const clubsSnap = await clubsRef.where("tribeTypeId", "==", "lycees_ac_limoges").get()

  let count = 0
  clubsSnap.docs.forEachAsyncParallel(async (doc) => {
    await doc.ref.delete()
    count++
  })

  return successResponse({ count })
})
