const admin = require("firebase-admin")
const db = admin.firestore()
const { ACTIVITY_TYPES } = require("../../constants")
const { ChallengeSettings, Challenge } = require("../../models")
const timestamp = admin.firestore.Timestamp

const cloneChallenge = async ({ challengeId, challengeIdToClone, subCollectionsToClone, haveToUpdateCalendar }) => {
  // Create challenge document
  await ChallengeSettings.create({ challengeId, id: "general" })
  await ChallengeSettings.create({ challengeId, id: "ranking" })

  const originRef = db.collection("challenges").doc(challengeIdToClone)
  const destinationRef = db.collection("challenges").doc(challengeId)
  await copyDocument(originRef, destinationRef)

  // Clone subcollections
  if (!subCollectionsToClone) return Challenge.fetch({ id: challengeId })

  if (subCollectionsToClone.questionSets) {
    subCollectionsToClone.phases = true
  }

  let challengeEndDate = null
  const newChallenge = await cloneChallengeCollections({
    subCollectionsToClone,
    originRef,
    destinationRef,
    challengeId,

    forEachDocHook: (collectionKey, doc) => {
      if (collectionKey === "questionSets") {
        // DO not copy icebreakers
        if (doc.type === ACTIVITY_TYPES.ICEBREAKER) return null
        doc.emailReportSent = false
        delete doc.notifications
        delete doc.generatedNotifications
      }
      return doc
    },
  })

  return newChallenge
}

const cloneChallengeCollections = async ({ originRef, destinationRef, challengeId, subCollectionsToClone, forEachDocHook }) => {
  const promises = []
  const newChallenge = {}
  Object.keys(subCollectionsToClone).forEach((subCollectionKey) => {
    const hasSubCollection = subCollectionsToClone[subCollectionKey]
    if (hasSubCollection) {
      const challengeCopyPromise = copyCollection({
        srcRef: originRef.collection(subCollectionKey),
        destRef: destinationRef.collection(subCollectionKey),
        challengeId,
        collectionKey: subCollectionKey,
        forEachDocHook,
      })
      promises.push(challengeCopyPromise)
    } else {
      newChallenge[subCollectionKey] = null
    }
  })
  await Promise.all(promises)
  return newChallenge
}

const copyCollection = async ({ srcRef, destRef, challengeId, collectionKey, forEachDocHook }) => {
  const documents = await srcRef.get()
  const writeBatch = db.batch()

  let i = 0
  for (const doc of documents.docs) {
    let data = doc.data()

    if (data.challengeId) {
      data.challengeId = challengeId
    }
    if (forEachDocHook) {
      data = forEachDocHook(collectionKey, data)
      if (!data) continue
    }

    writeBatch.set(destRef.doc(doc.id), data)
    i++
    if (i > 400) {
      // write batch only allows maximum 500 writes per batch
      i = 0
      console.log("Intermediate committing of batch operation")
      // await writeBatch.commit();
      // writeBatch = firebaseAdmin.firestore().batch();
    }
  }

  if (i > 0) {
    console.log("Firebase batch operation completed. Doing final committing of batch operation.")
    await writeBatch.commit()
  } else {
    console.log("Firebase batch operation completed.")
  }
}

const copyDocument = async (srcRef, destRef) => {
  const doc = await srcRef.get()
  return destRef.set(doc.data())
}

module.exports = {
  cloneChallenge,
}
