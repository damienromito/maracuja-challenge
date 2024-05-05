const admin = require("firebase-admin")
const { ACTIVITY_TYPES } = require("../constants")
const { Player, Team } = require("../models")
const fieldValue = admin.firestore.FieldValue
const db = admin.firestore()
const firebaseTimestamp = admin.firestore.Timestamp

const participateToActivity = async (data) => {
  const timestampNow = firebaseTimestamp.now()

  const { activitiesTypeKey, activityId, hookBeforeUpdate, hookWillUpdateTeamScores, challengeId, multipleParticipation, score = null, playerId, teamId, phaseId } = data

  const player = await Player.fetch({ challengeId, id: playerId })
  // const playerScores = player.scores
  const challengeRef = db.collection("challenges").doc(challengeId)
  const playerRef = challengeRef.collection("players").doc(playerId)
  const teamRef = challengeRef.collection("teams").doc(teamId)
  const newPlayer = { lastActivityAt: timestampNow }
  const newTeam = {}

  /// ////////////////////////////////
  // const oldPhaseStats = oldPhase?._stats
  const oldPhase = player.scores?.[phaseId]
  const oldPhaseStats = player.scores?.[phaseId]?._stats

  const oldActivityType = oldPhase?.[activitiesTypeKey]
  const oldActivityTypeStats = oldActivityType?._stats
  const oldActivityStats = oldActivityType?.[activityId]?._stats
  const alreadyParticipe = !!(oldActivityStats && oldActivityStats?.count != null)

  // CAN UPDATE SCORE OR NOT ?
  let scoreCanBeUpdated = !!(score !== null)
  if (scoreCanBeUpdated && alreadyParticipe) {
    if (multipleParticipation) {
      if (activitiesTypeKey === ACTIVITY_TYPES.TRAINING && oldActivityStats.score >= score) {
        scoreCanBeUpdated = false
      }
    } else {
      scoreCanBeUpdated = false
    }
  }

  // PATH SHORTCUTS
  const phasePath = `scores.${phaseId}`
  const phasePathStats = `scores.${phaseId}._stats`
  const activityTypeStatsPath = `${phasePath}.${activitiesTypeKey}._stats`
  const activityPath = `${phasePath}.${activitiesTypeKey}.${activityId}`
  const activityStatsPath = `${activityPath}._stats`
  const teamPlayerPath = `players.${playerId}`

  const newPlayerScoresObject = {
    _stats: {},
    [phaseId]: {
      _stats: {},
      [activitiesTypeKey]: {
        _stats: {},
        [activityId]: {
          _stats: {},
        },
      },
    },
  }

  const addTeamScoreParticipation = ({ key, value }) => {
    newTeam[`${activityTypeStatsPath}.${key}`] = value
    newTeam[`${activityStatsPath}.${key}`] = value
    newTeam[`${phasePathStats}.${key}`] = value
  }

  // Cette fonction
  const setParticipation = ({ key, value, activityTypeValue, increment, updatePhaseScore = true }) => {
    // PHASE
    const pValue = value || increment + (oldPhaseStats?.[key] || 0)
    if (updatePhaseScore) {
      newPlayer[`${phasePathStats}.${key}`] = fieldValue.increment(increment)
      newTeam[`${teamPlayerPath}.${phasePathStats}.${key}`] = fieldValue.increment(increment)
    }

    // ACTIVITY TYPE
    const aTValue = activityTypeValue != null ? activityTypeValue : value || increment + (oldActivityTypeStats?.[key] || 0)
    newPlayer[`${activityTypeStatsPath}.${key}`] = aTValue
    newTeam[`${teamPlayerPath}.${activityTypeStatsPath}.${key}`] = aTValue

    // ACTIVITY
    const aValue = value || (increment || 0) + (oldActivityStats?.[key] || 0)
    newPlayer[`${activityStatsPath}.${key}`] = aValue
    newTeam[`${teamPlayerPath}.${activityStatsPath}.${key}`] = aValue

    // Si le hook se charge d'updater le score de la team, alors on crée un object plutot que d'updater firestore
    if (hookWillUpdateTeamScores) {
      updatePhaseScore && (newPlayerScoresObject[phaseId]._stats[key] = pValue) // PHASE
      newPlayerScoresObject[phaseId][activitiesTypeKey]._stats[key] = aTValue // ACTIVITY TYPE
      newPlayerScoresObject[phaseId][activitiesTypeKey][activityId]._stats[key] = aValue // ACTIVITY
    } else {
      addTeamScoreParticipation({ key, value: increment ? fieldValue.increment(increment) : value })
    }
  }

  newPlayer[`${activityTypeStatsPath}.lastParticipationAt`] = timestampNow
  newPlayer[`${activityStatsPath}.lastParticipationAt`] = timestampNow
  setParticipation({ key: "count", increment: 1 })

  if (scoreCanBeUpdated) {
    setParticipation({ key: "score", increment: score })
  }

  newTeam.lastActionAt = timestampNow
  newTeam.scoresUpdatedAt = timestampNow
  newTeam.lastActionPhaseId = phaseId

  // CALL HOOK TO ADD SPECIFIC VALUES
  const oldTeam = hookWillUpdateTeamScores ? await Team.fetch({ challengeId, id: teamId }) : null

  hookBeforeUpdate &&
    (await hookBeforeUpdate({
      alreadyParticipe,
      newPlayer,
      newPlayerScoresObject,
      newTeam,
      oldTeam,
      oldPlayer: player,
      oldActivityStats,
      oldActivityTypeStats,
      scoreCanBeUpdated,
      setParticipation,
    }))

  // SAVE IN DB
  const batch = db.batch()
  // console.log("newPlayer")
  // console.dir(newPlayer, { depth: null })

  batch.update(playerRef, newPlayer)
  batch.update(teamRef, newTeam)
  await batch.commit()
  return { alreadyParticipe }
}

// const deleteParticipation  = ({
//   challengeId,
//   activitiesTypeKey,
//   activityId,
//   score,
//   playerId,
//   teamId,
//   phaseId,
//   }) => {

//   //score   activityId

// }

module.exports = {
  participateToActivity,
}
