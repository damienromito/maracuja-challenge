const admin = require("firebase-admin")
const { objectSubset } = require("../utils")
const ChallengeCollection = require("./ChallengeCollection")
const FirebaseObject = require("./FirebaseObject")
const db = admin.firestore()

module.exports = class Game extends FirebaseObject {
  static collectionPath({ challengeId }) {
    return `challenges/${challengeId}/games`
  }
  collectionPath() {
    return `challenges/${this.challengeId}/games`
  }

  constructor(state) {
    super(state, { collection: "games" })
    Object.assign(this, state)
  }

  static async fetchLastGame({ challengeId, playerId, questionSetId, activityType }) {
    const games = await Game.fetchAll(
      { challengeId },
      {
        refHook: (ref) => ref.where("player.id", "==", playerId).where("questionSet.id", "==", questionSetId).where("questionSet.type", "==", activityType).orderBy("createdAt", "desc"),
      }
    )
    const lastGame = games[0]
    return lastGame
  }

  static fetchDeviceIdIdenticalCount = async ({ deviceId, challengeId, questionSetId, playerId }) => {
    return 0 //DISABLED
    // if(!deviceId || deviceId === 'VIRTUAL' ) return 0
    // let queryRef = db.collection('challenges').doc(challengeId).collection('games')
    //   .where('deviceId', '==', deviceId)
    //   .where('questionSet.id', '==', questionSetId)
    // if(playerId){
    //   queryRef = queryRef.where('player.id', '!=', playerId)
    // }
    // const gamesWithIdenticalIpSnap = await queryRef.get()
    // let distinctObject = {}
    // gamesWithIdenticalIpSnap.docs.forEach(doc => {
    //   const game = doc.data()
    //   distinctObject[game.player.id] = true
    // })
    // return Object.keys(distinctObject).length
  }
}
