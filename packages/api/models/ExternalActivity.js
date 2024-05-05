const admin = require("firebase-admin")
const ChallengeCollection = require("./ChallengeCollection")
const FirebaseObject = require("./FirebaseObject")
const db = admin.firestore()

module.exports = class ExternalActivity extends FirebaseObject {
  static collectionPath({ challengeId }) {
    return `challenges/${challengeId}/externalActivities`
  }
  collectionPath() {
    return `challenges/${this.challengeId}/externalActivities`
  }
}
