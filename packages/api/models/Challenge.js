const admin = require("firebase-admin")
const { sortedDatedObjects } = require("../utils")
const FirebaseObject = require("./FirebaseObject")
const Phase = require("./Phase")
const db = admin.firestore()

module.exports = class Challenge extends FirebaseObject {
  static collectionPath() {
    return "challenges"
  }
  collectionPath() {
    return "challenges"
  }

  constructor(state) {
    super(state)
  }

  sortedQuestionSets({ maxDate, byEndDate, hook } = {}) {
    const sortBy = byEndDate ? "endDate" : "startDate"
    return sortedDatedObjects(
      this.questionSets,
      (qs) => {
        if (maxDate && qs[sortBy] > maxDate) return null
        if (hook) return hook(qs)
        return qs
      },
      sortBy
    )
  }

  sortedPhases() {
    return sortedDatedObjects(this.phases)
  }

  getCurrentPhase() {
    const now = new Date()
    const phases = this.getPhases()
    const currentPhase = phases?.find((phase) => phase.startDate < now && phase.endDate > now)
    if (!currentPhase) return phases[0]
    return currentPhase
  }

  getPhases() {
    return (
      this.phases &&
      Object.keys(this.phases).map((key) => {
        const phase = this.phases[key]
        phase.id = key
        return new Phase(phase)
      })
    )
  }

  // static fetch = async ({challengeId}) => {
  //   let challengeRef = db.collection("challenges").doc(challengeId)
  //   const challenge = await FirebaseObject.fetchRef(challengeRef)
  //   return new Challenge(challenge)
  // }

  // static update = async ({challengeId,data}) => {
  //   console.log('challengeId:', challengeId)
  //   let challengeRef = db.collection("challenges").doc(challengeId)
  //   return await challengeRef.update(data)
  // }

  static fetchAllCurrent = async ({ hook } = {}) => {
    const now = new Date()
    const challenges = await Challenge.fetchAll({}, { refHook: (ref) => ref.where("endDate", ">=", now) })
    if (!challenges) return false
    if (!hook) return challenges

    const promises = challenges.map((challenge) => {
      return hook(challenge)
    })
    await Promise.all(promises)
    return challenges
  }
}
