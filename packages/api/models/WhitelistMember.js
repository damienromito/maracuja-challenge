const admin = require("firebase-admin")
const FirebaseObject = require("./FirebaseObject")
const User = require("./User")
const db = admin.firestore()
const timestamp = admin.firestore.Timestamp

module.exports = class WhitelistMember extends FirebaseObject {
  static collectionPath({ challengeId }) {
    return `challenges/${challengeId}/whitelistMembers`
  }
  collectionPath() {
    return `challenges/${this.challengeId}/whitelistMembers`
  }

  static async create({ firstName, lastName, roles, clubId, email, challengeId, id, username, phoneNumber }) {
    const db = admin.firestore()
    let whitelistMemberRef = db.collection("challenges").doc(challengeId).collection("whitelistMembers")
    let userId = id
    if (userId) {
      whitelistMemberRef = whitelistMemberRef.doc(id)
    } else {
      const refId = User.generateId(username || firstName)
      whitelistMemberRef = whitelistMemberRef.doc(refId)
      userId = whitelistMemberRef.id
    }

    await whitelistMemberRef.set({
      firstName,
      lastName,
      roles,
      clubId,
      email,
      challengeId,
      username,
      phoneNumber,
      subscribed: false,
      subscriptionEmailSent: false,
      subscriptionSmsSent: false,
      subscriptionEmailRetrySent: false,
      subscriptionSmsRetrySent: false,
      createdAt: timestamp.now(),
    })
    return userId
  }

  static async fetchByAudience({ challengeId, audience }) {
    const members = await WhitelistMember.fetchAll(
      { challengeId },
      {
        refHook: (ref) => {
          if (audience === "captains") {
            return ref.where("roles", "array-contains", "CAPTAIN")
          } else if (audience === "notSubscribed") {
            return ref.where("subscribed", "!=", true)
          } else {
            return ref
          }
        },
      }
    )
    return members
  }

  static async fetchByEmail({ email, challengeId }) {
    const membersRef = db.collection("challenges").doc(challengeId).collection("whitelistMembers")
    const membersSnap = await membersRef.where("email", "==", email).get()
    const members = FirebaseObject.parseSnapCollection(membersSnap)
    return members?.[0]
  }
}
