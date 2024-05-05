
const functions = require('firebase-functions').region('europe-west1')
const admin = require('firebase-admin');
const { objectFromSnap } = require('../../models/FirebaseObject');
const { objectSubset } = require('../../utils');
const { participateToActivity } = require('../../utils/activities');
const { authOnCall } = require('../../utils/functions');
const { successResponse } = require('../../utils/response');
const db = admin.firestore()

const timestamp = admin.firestore.Timestamp

exports = module.exports = authOnCall({auth : true}, async (data, context) => {

  const {lottery, challengeId, player, team} = data
  const challengeRef = db.collection('challenges').doc(challengeId)
  const lotteryRef = challengeRef.collection('lotteries').doc(lottery.id)


  const result = await participateToActivity ({  
    activitiesTypeKey: "lotteries",
    activityId: lottery.id,
    challengeId ,
    multipleParticipation: false,
    phaseId : lottery.phaseId,
    playerId : player.id,
    teamId : team.id,
  })

  if(result.alreadyParticipe){
    return successResponse({message : "Tu as déjà participé"})
  }

  let newLottery, subscriptionCount

  await db.runTransaction(async transaction => {

    const snap = await transaction.get(lotteryRef)
    newLottery  = objectFromSnap(snap)

    subscriptionCount = (newLottery.subscriptionCount || 0) + 1
    await transaction.update(lotteryRef, { subscriptionCount })

    const subscription = {
      player,
      team,
      subscriptionNumber : subscriptionCount,
      lotteryId : lottery.id,
      createdAt : timestamp.now()
    }
    const subscriptionId = `${(player.id)}_${lottery.id}`
    await transaction.set(challengeRef.collection("lotteriesSubscriptions").doc(subscriptionId), subscription)
  })

 
  const response = {
    lottery : {
      subscriptionCount,
      ...objectSubset(newLottery, [
      'id',
      'name',
      'description',
      'image',
      'prizesInfo',
      'link',
      'lottery'
      ])
    }
  }

  return successResponse(response)
})


