const admin = require("firebase-admin")
const { objectFromSnap, objectsFromSnap, promiseBatchByChunks } = require("../")
const { NOTIFICATION_AUDIENCES, ACTIVITY_TYPES } = require("../../constants")
const { debug } = require("firebase-functions/lib/logger")

const db = admin.firestore()

const getPlayer = async (challengeId, playerId) => {
  let playerSnap
  try {
    playerSnap = await db.collection("challenges").doc(challengeId).collection("players").doc(playerId).get()
    if (!playerSnap.exists) {
      throw Error("Player not exist")
    }
  } catch (err) {
    throw Error(err)
  }
  return objectFromSnap(playerSnap)
}

const getPlayersToNotify = async ({ challengeId, playerIds }) => {
  const playersRef = db.collection("challenges").doc(challengeId).collection("players").where("acceptNotification", "==", true)

  if (!playerIds) {
    const playersSnap = await playersRef.get()
    return objectsFromSnap(playersSnap)
  } else if (playerIds.length) {
    const promises = promiseBatchByChunks(
      playerIds,
      (playerIdsChunk) => {
        return playersRef.where(admin.firestore.FieldPath.documentId(), "in", playerIdsChunk).get()
      },
      10
    )

    const chunkResults = await Promise.all(promises)
    let players = []

    chunkResults.forEach((playersSnap) => {
      if (!playersSnap.size) {
        return false
      }
      const playersChunk = objectsFromSnap(playersSnap)
      players = players.concat(playersChunk)
    })
    return players
  }
}

const getPlayersByAudience = async (audience = "all", { challengeId, teamIds, questionSetId, questionSetType, questionSetPhaseId, phaseId, platform }) => {
  let playersRef = db.collection("challenges").doc(challengeId).collection("players")
  let authorizedTeams = []
  if (phaseId) {
    const snap = await db.collection("challenges").doc(challengeId).collection("rankings").doc(phaseId).get()
    authorizedTeams = objectFromSnap(snap).authorizedClubs
  }

  if (audience === NOTIFICATION_AUDIENCES.CAPTAINS) {
    playersRef = playersRef.where("roles", "array-contains", "CAPTAIN")
  } else if (audience === NOTIFICATION_AUDIENCES.REFEREES) {
    playersRef = playersRef.where("roles", "array-contains", "REFEREE")
  } else if (audience === NOTIFICATION_AUDIENCES.REFERERS) {
    playersRef = playersRef.where("refereeCount", ">=", 1)
  } else if (audience === NOTIFICATION_AUDIENCES.TEAMS) {
    if (teamIds.length > 10) throw Error("Pas plus de 10 équipe !")
    playersRef = playersRef.where("clubId", "in", teamIds)
  } else if (audience === NOTIFICATION_AUDIENCES.ALREADY_PLAYED) {
    playersRef = playersRef.where(`scores.${questionSetPhaseId}.${questionSetType}s.${questionSetId}._stats.count`, ">=", 1)
  }

  const playersSnap = await playersRef.get()
  // console.log('playersSnap.size:', playersSnap.size)
  if (!playersSnap.size) {
    debug("No players in the challenge " + challengeId)
    return []
  }

  const players = []
  playersSnap.docs.forEach((doc) => {
    const player = objectFromSnap(doc)
    if (audience === NOTIFICATION_AUDIENCES.ASLEEP) {
      if (questionSetType === ACTIVITY_TYPES.DEBRIEFING) {
        const contestStats = player.scores?.[questionSetPhaseId]?.contests?.[questionSetId]?._stats
        if (!(contestStats?.count && contestStats.score < contestStats.questionCount)) {
          return
        }
      }
      if (player.scores?.[questionSetPhaseId]?.[`${questionSetType}s`]?.[questionSetId]?._stats?.count) {
        return
      }
    }
    if (phaseId && authorizedTeams && !authorizedTeams?.includes(player.club?.id)) {
      return
    }
    if (platform) {
      if (player.platform !== platform) {
        return
      }
    }
    players.push(player)
  })

  return players
}

const updatePlayer = (challengeId, playerId, data) => {
  const playerRef = db.collection("challenges").doc(challengeId).collection("players").doc(playerId)
  return playerRef.update(data)
}

const fetchPublicIpIdenticalCount = async ({ publicIp, challengeId, currentPlayerId }) => {
  if (!publicIp) return 0
  const challengeRef = db.collection("challenges").doc(challengeId)
  let queryRef = challengeRef.collection("players").where("publicIp", "==", publicIp)
  if (currentPlayerId) {
    queryRef = queryRef.where(admin.firestore.FieldPath.documentId(), "!=", currentPlayerId)
  }
  const playersWithIpSnap = await queryRef.get()

  return playersWithIpSnap.size
}

const getTeamPhaseParticipation = ({ teamId, phases, rankings }) => {
  const phasesParticipations = {}
  let previousPhasePriced = false
  phases.forEach((phase) => {
    if (!previousPhasePriced) {
      phasesParticipations[phase.id] = true
    } else {
      // chercher si la team est dans authorizedclub d'un ranking
      const ranking = rankings.find((r) => {
        return r.phase.id === phase.id && r.authorizedClubs.includes(teamId)
      })
      phasesParticipations[phase.id] = !!ranking
    }
    if (phase.priceCount) {
      previousPhasePriced = true
    }
  })
  return phasesParticipations
}

const teamsPhasesParticipation = {}

const calcPlayerEngagment = (player, { phases, rankings, questionSets }) => {
  const teamId = player.club.id
  if (!teamsPhasesParticipation[teamId]) {
    teamsPhasesParticipation[teamId] = getTeamPhaseParticipation({ teamId, phases, rankings })
  }
  let participationCount = 0
  let participationTrainingCount = 0
  let participationContestCount = 0
  let participationDebriefingCount = 0
  let possibleParticipationCount = 0
  let possibleTrainingCount = 0
  let possibleContestCount = 0
  questionSets.forEach((qs) => {
    player.createdAt = (player.createdAt.toDate && player.createdAt.toDate()) || player.createdAt
    // si la team est dans un ranking && il s'est inscrit avant la fin du quiz
    if (teamsPhasesParticipation[teamId][qs.phase.id] && player.createdAt < qs.endDate) {
      possibleParticipationCount++
      qs.type === ACTIVITY_TYPES.CONTEST ? possibleContestCount++ : possibleTrainingCount++
      const qsScore = player.scores?.[qs.phase.id]?.[`${qs.type}s`]?.[qs.id]?._stats
      if (qsScore) {
        participationCount++

        if (qs.type === ACTIVITY_TYPES.CONTEST) {
          participationContestCount++
          const debriefingScore = player.scores?.[qs.phase.id]?.debriefings?.[qs.id]?._stats
          if (debriefingScore) {
            participationDebriefingCount++
          }
        } else if (qs.type === ACTIVITY_TYPES.TRAINING) {
          participationTrainingCount++
        }
      }
    }
  })

  const playerEngagment = {}
  playerEngagment.participationTrainingCount = participationTrainingCount
  playerEngagment.engagmentTrainingRate = participationTrainingCount ? participationTrainingCount / possibleTrainingCount : 0
  playerEngagment.possibleTrainingCount = possibleTrainingCount

  playerEngagment.participationContestCount = participationContestCount
  playerEngagment.engagmentContestRate = participationContestCount ? participationContestCount / possibleContestCount : 0
  playerEngagment.possibleContestCount = possibleContestCount

  playerEngagment.participationDebriefingCount = participationDebriefingCount
  playerEngagment.engagmentDebriefingRate = participationDebriefingCount ? participationDebriefingCount / possibleContestCount : 0
  playerEngagment.possibleDebriefingCount = possibleContestCount

  playerEngagment.participationCount = participationCount
  playerEngagment.possibleParticipationCount = possibleParticipationCount
  playerEngagment.engagmentRate = participationCount ? participationCount / possibleParticipationCount : 0

  return playerEngagment
}

module.exports = {
  calcPlayerEngagment,
  getPlayer,
  getPlayersToNotify,
  getPlayersByAudience,
  updatePlayer,
  fetchPublicIpIdenticalCount,
}
