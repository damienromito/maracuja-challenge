const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { objectFromSnap } = require("../../models/FirebaseObject")
const { objectSubset } = require("../../utils")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")

const { successResponse } = require("../../utils/response")
const { authOnCall } = require("../../utils/functions")
const { USER_ROLES } = require("../../constants")
const db = admin.firestore()

const timestamp = admin.firestore.Timestamp
const fieldPath = admin.firestore.FieldPath

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  const { challengeId, lotteryId, winnerCount, subscriptionCount } = data
  const challengeRef = db.collection("challenges").doc(challengeId)
  const lotteryRef = challengeRef.collection("lotteries").doc(lotteryId)
  const playersRef = challengeRef.collection("players")
  const lotteriesSubscriptionsRef = challengeRef.collection("lotteriesSubscriptions")

  const winnersNumber = []
  loadWinnerNumbers({ subscriptionCount, winnersNumber, winnerCount })

  info("Numéros tirés au sort:", winnersNumber)
  const snap = await lotteriesSubscriptionsRef.where("subscriptionNumber", "in", winnersNumber).where("lotteryId", "==", lotteryId).get()
  // const snap = await lotteriesSubscriptionsRef.where('subscriptionNumber', 'in', winnersNumber ).get()

  const winners = snap.docs.map((doc) => {
    const winner = doc.data()
    return {
      id: winner.player.id,
      username: winner.player.username,
      teamName: winner.team.name,
      subscriptionId: doc.id,
      subscriptionNumber: winner.subscriptionNumber,
    }
  })

  await lotteryRef.update({
    winners,
    drawnAt: timestamp.now(),
  })

  return successResponse({ winners })
})

const loadWinnerNumbers = ({ subscriptionCount, winnersNumber, winnerCount }) => {
  const number = getRandomInt(0, subscriptionCount)
  if (winnersNumber.includes(number)) {
    return loadWinnerNumbers({ subscriptionCount, winnersNumber, winnerCount })
  }
  winnersNumber.push(number)
  if (winnersNumber.length < winnerCount) {
    return loadWinnerNumbers({ subscriptionCount, winnersNumber, winnerCount })
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
