const admin = require("firebase-admin")
const { objectSubset } = require("../utils")
const FirebaseObject = require("./FirebaseObject")
const db = admin.firestore()

module.exports = class Idea extends FirebaseObject {
  static collectionPath({ challengeId }) {
    return `challenges/${challengeId}/ideas`
  }
  collectionPath() {
    return `challenges/${this.challengeId}/ideas`
  }

  constructor(state) {
    super(state)
    Object.assign(this, state)
  }

  // static fetch = async ({challengeId, teamId}) => {
  //   let teamsRef = db.collection("challenges").doc(challengeId).collection('teams').doc(teamId)
  //   const team = await FirebaseObject.fetchRef(teamsRef)
  //   return team
  // }

  static fetchByProperty = async ({
    challengeId,
    propertyKey,
    propertyValue,
    returnFirstElem = true,
    comparator,
  }) => {
    return await FirebaseObject.fetchByProperty({
      collectionKey: "challenges",
      collectionDocId: challengeId,
      subCollectionKey: "ideas",
      propertyKey,
      propertyValue,
      returnFirstElem,
      comparator,
    })
  }

  // static update = async ({teamId,challengeId}, data) => {
  //   console.log('data:', data)
  //   let teamsRef = db.collection("challenges").doc(challengeId).collection('teams').doc(teamId)
  //   return await teamsRef.update(data)
  // }
}
