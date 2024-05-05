const admin = require("firebase-admin")
const FirebaseObject = require("./FirebaseObject")
const { stringToId, generateId } = require("../utils/")
const { nanoid } = require("nanoid")
const db = admin.firestore()
const timestamp = admin.firestore.Timestamp
const fieldValue = admin.firestore.FieldValue

module.exports = class User extends FirebaseObject {
  static collectionPath() {
    return "users"
  }
  collectionPath() {
    return "users"
  }

  static async fetchByEmail({ email }) {
    const userRef = db.collection("users")
    const userSnap = await userRef.where("email", "==", email).get()
    const users = FirebaseObject.parseSnapCollection(userSnap)
    return users?.[0]
  }

  static generateId(username) {
    return nanoid(30)
    // return `${stringToId(username).substr(0, 8)}_${nanoid(18)}`
  }

  static async createAuthUserWithEmailAndPassword({ email, password, username, id }) {
    // a supprimer quand userscreatev2 N'EST PLUS en prod
    const params = {
      email,
      password,
      displayName: username,
      uid: id || generateId(username),
    }

    const authUser = await admin.auth().createUser(params)
    return authUser
  }

  static async createUserWithEmailAndPassword({ email, password, username, firstName, id }) {
    console.log("id:", id)
    const authUser = await admin.auth().createUser({
      email,
      password,
      displayName: username,
      uid: id || null,
    })

    const userRef = db.collection("users").doc(id)
    await userRef.set({
      email,
      username,
      firstName,
      createdAt: timestamp.now(),
    })

    return authUser
  }

  static async addRole({ userId, challengeId, organisationId, role }) {
    await admin.auth().setCustomUserClaims(userId, { roles: ["ADMIN"] })

    // TODO to delete
    const userRef = db.collection("users").doc(userId)

    const newUser = {}
    if (challengeId) {
      newUser[`organisations.${organisationId}.challenges`] = fieldValue.arrayUnion(challengeId)
    }
    newUser[`organisations.${organisationId}.roles`] = fieldValue.arrayUnion(role)
    newUser.roles = fieldValue.arrayUnion("ADMIN")

    await userRef.update(newUser)
  }
}
