const admin = require("firebase-admin")
const { MARACUJA_CLUB_ID } = require("../constants")
const { objectSubset } = require("../utils")
const ChallengeCollection = require("./ChallengeCollection")
const FirebaseObject = require("./FirebaseObject")
const db = admin.firestore()

module.exports = class ChallengeSettings extends FirebaseObject {
  static collectionKey = "settings"
  static collectionPath({ challengeId }) {
    return `challenges/${challengeId}/settings`
  }
  collectionPath() {
    return `challenges/${this.challengeId}/settings`
  }

  constructor(state) {
    super(state)

    if (state.staff) {
      state.staff = Object.keys(state.staff).map((key) => state.staff[key])
    }
    Object.assign(this, state)
  }

  static updateStats({ teamId = false, challengeId }, data) {
    if ((!teamId || teamId !== MARACUJA_CLUB_ID) && Object.keys(data).length) {
      return super.update({ challengeId, id: "stats" }, data)
    }
  }

  static fetchAllCurrentRankings = async ({ hook }) => {
    const now = new Date()
    const ref = db.collectionGroup("settings").where("challenge.endDate", ">=", now)

    const rankings = await FirebaseObject.fetchListRef(ref, {
      initializer: (data) => {
        return new this(data)
      },
    })

    if (!hook) return rankings
    if (!rankings) {
      console.log("Aucun challenge en cours")
      return null
    }

    const promises = rankings.map((ranking) => {
      return hook(ranking)
    })
    return Promise.all(promises)
  }
}
