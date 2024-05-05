const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const db = admin.firestore()

const fs = require("fs") // Filesystem
const { ChallengeStats } = require("../../models")
const { sendEmailNotifications } = require("../../utils/notifications/email")
const { successResponse } = require("../../utils/response")

exports = module.exports = functions.https.onCall(async (data, context) => {
  const stats = await ChallengeStats.fetchAll()
  console.log("stats:", stats)

  const promises = stats.map((stat) => {
    console.log("stat:", stat)
    const originRef = db.collection("stats/challenges/list").doc(stat.id)
    const destinationRef = db.collection(`challenges/${stat.id}/settings`).doc("stats")
    return copyDocument(originRef, destinationRef)
  })

  await promises.all()

  return successResponse()
})

const copyDocument = async (srcRef, destRef) => {
  const doc = await srcRef.get()
  return destRef.set(doc.data())
}
