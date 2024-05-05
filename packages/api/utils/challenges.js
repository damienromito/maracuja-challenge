const admin = require("firebase-admin")
const { utimestampFromData } = require(".")
const { MARACUJA_CLUB_ID } = require("../constants")
const { ChallengeSettings } = require("../models")
const Challenge = require("../models/Challenge")
const Player = require("../models/Player")
const Ranking = require("../models/Ranking")
const { calcPlayerEngagment } = require("./players")
const db = admin.firestore()

const getActivePhase = (challenge) => {
  const sortedPhases = Object.keys(challenge.phases).sort((a, b) => challenge.phases[a].startDate.toDate() - challenge.phases[b].startDate.toDate())

  let currentPhase = null
  sortedPhases.forEach((phaseId) => {
    const phase = challenge.phases[phaseId]
    const now = Date.now()
    if (now >= utimestampFromData(phase.startDate) && now <= utimestampFromData(phase.endDate)) {
      currentPhase = phase
      return phase
    }
  })
  return currentPhase
}

const calculateEngagementInChallenge = async ({ challenge }) => {
  const challengeId = challenge.id
  const questionSets = challenge.sortedQuestionSets({ maxDate: new Date(), byEndDate: true })

  const phases = challenge.sortedPhases()
  const rankings = await Ranking.fetchAll({ challengeId })

  const players = await Player.fetchAll(
    { challengeId },
    {
      refHook: (ref) => ref.where("club.id", "!=", MARACUJA_CLUB_ID),
    }
  )

  const playerCount = players.length

  if (!playerCount) return null

  let sumEngagement = 0
  const batch = db.batch()
  players.forEach((player) => {
    const playerEngagement = calcPlayerEngagment(player, { phases, rankings, questionSets })
    sumEngagement += playerEngagement.engagmentRate
    batch.update(player.documentRef(), {
      engagment: {
        total: playerEngagement.engagmentRate,
      },
    })
  })

  const playersEngagement = sumEngagement / playerCount

  await ChallengeSettings.updateStats({ challengeId }, { playersEngagement })
  await batch.commit()
  return playersEngagement
}

const getChallenge = async (challengeId) => {
  const db = admin.firestore()
  let challengeSnap
  try {
    challengeSnap = await db.collection("challenges").doc(challengeId).get()
  } catch (err) {
    throw Error(err)
  }
  return challengeSnap.data()
}

module.exports = {
  getChallenge,
  getActivePhase,
  // getActiveChallengePreviews,
  // activeChallengesHook,
  calculateEngagementInChallenge,
}
