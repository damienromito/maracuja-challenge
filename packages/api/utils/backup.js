const functions = require("firebase-functions")
const firestore = require("@google-cloud/firestore")
const client = new firestore.v1.FirestoreAdminClient()

// From https://firebase.google.com/docs/firestore/solutions/schedule-export

exports = module.exports = (suffix = "") => {
  const bucket = "gs://" + functions.config().storage.backup
  const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT
  const databaseName = client.databasePath(projectId, "(default)")
  const date = new Date().toISOString().split("T")[0]
  const outputFolder = bucket + "/" + suffix + "/" + date

  console.log(`Start Backup of ${projectId} in ${outputFolder}`)

  return client
    .exportDocuments({
      name: databaseName,
      outputUriPrefix: outputFolder,
      // Leave collectionIds empty to export all collections
      // or set to a list of collection IDs to export,
      // collectionIds: ['users', 'posts']
      collectionIds: [],
    })
    .then((responses) => {
      const response = responses[0]
      console.log(`Operation Name: ${response.name}`)
      return true
    })
    .catch((err) => {
      console.error(err)
      throw new Error("Export operation failed")
    })
}
