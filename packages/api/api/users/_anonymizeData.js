const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")

const db = admin.firestore()
const fieldValue = admin.firestore.FieldValue

const runtimeOpts = {
  timeoutSeconds: 540,
  memory: "2GB",
}

exports = module.exports = functions.runWith(runtimeOpts).https.onCall(async (data, context) => {
  const userSnaps = await db.collection("users").where("challengeIds", "array-contains", "generali").limit(1600).get()

  let currentIndex = 0
  let deleteUserCount = 0
  let keepCount = 0
  let unexistantUser = 0
  const cleanUsers = async () => {
    const doc = userSnaps.docs[currentIndex]
    const user = doc.data()
    const userId = doc.id
    await cleanPlayer({ userId })
    await cleanUser({ userId })

    if (user.challengeIds.length === 1) {
      try {
        await admin.auth().deleteUser(userId)
      } catch (error) {
        await deleteUser({ userId })
        unexistantUser++
      }
      deleteUserCount++
    } else {
      keepCount++
    }

    if (currentIndex < userSnaps.size - 1) {
      currentIndex++
      await cleanUsers()
    }
  }

  await cleanUsers()

  return { deleteUserCount, totalUsersCleaned: userSnaps.size }
})

const cleanPlayer = ({ userId }) => {
  const playerRef = db.collection("challenges").doc("generali").collection("players").doc(userId)
  const newPlayer = {
    email: fieldValue.delete(),
    phoneNumber: fieldValue.delete(),
    username: fieldValue.delete(),
    licenseNumber: fieldValue.delete(),
    birthday: fieldValue.delete(),
    firstName: fieldValue.delete(),
  }
  return playerRef.update(newPlayer)
}

const cleanUser = ({ userId }) => {
  const userRef = db.collection("users").doc(userId)
  const newUser = {
    challengeIds: fieldValue.arrayRemove("generali"),
  }
  return userRef.update(newUser)
}

const deleteUser = ({ userId }) => {
  const userRef = db.collection("users").doc(userId)
  return userRef.delete()
}
