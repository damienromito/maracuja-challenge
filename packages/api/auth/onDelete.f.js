  const functions = require('firebase-functions').region('europe-west1')
  const admin = require('firebase-admin')
  
  const { debug, info, error, warn } = require("firebase-functions/lib/logger")

  exports = module.exports = functions.auth.user()
    .onDelete(user => {
      const db = admin.firestore()
      return db.collection("users").doc(user.uid).delete()
    })

