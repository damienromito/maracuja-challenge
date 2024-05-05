const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")

exports = module.exports = functions.firestore.document("challenges/{challengeId}").onDelete(async (snap, context) => {
  const challenge = snap.data()
  const FieldValue = admin.firestore.FieldValue

  const db = admin.firestore()
  const challengeId = context.params.challengeId

  if (challenge.organisationsIds && challenge.organisationsIds.length > 0) {
    challenge.organisationsIds.forEach(async (organisationId) => {
      const organisationRef = db.collection("organisations").doc(organisationId)
      const newOrganisation = {}
      newOrganisation[`challenges.${challengeId}`] = FieldValue.delete()
      await organisationRef.update(newOrganisation)
    })
  }

  return true
})
