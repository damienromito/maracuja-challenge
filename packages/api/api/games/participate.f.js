const functions = require("firebase-functions")
const admin = require("firebase-admin")
const { errorResponse, successResponse } = require("../../utils/response")
const { objectSubset, stringToId } = require("../../utils")
const { ACTIVITY_TYPES, MARACUJA_CLUB_ID } = require("../../constants")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { Game, ChallengeSettings } = require("../../models")
const { participateToActivity } = require("../../utils/activities")

const FieldValue = admin.firestore.FieldValue
const db = admin.firestore()
const merge = require("lodash.merge")
const { getTeamScoresForPhase } = require("../../utils/rankings")
const { nanoid } = require("nanoid")
const { authOnCall } = require("../../utils/functions")

const ANTI_CHEAT_LIMIT = 3
const WARNING_ANTI_CHEAT_TITLE = `Le réglement interdit l'inscription de plus de ${ANTI_CHEAT_LIMIT} joueurs sur le même téléphone. 👈 `
const WARNING_ANTI_CHEAT_MESSAGE = "D’autres personnes de ton équipe souhaitent participer ? Invite-les à utiliser leur propre téléphone."

exports = module.exports = authOnCall({ auth: true }, async (data, context) => {
  const timestampNow = admin.firestore.Timestamp.now()
  const { deviceId, questionSet, phase, challengeId, topPlayers, player, team } = data
  console.log(`>GAME WILL BE CREATED ${player.username} (${player.id}) - ${questionSet.id})`, data, topPlayers)

  // CHECK PERIOD
  if (questionSet.type === ACTIVITY_TYPES.CONTEST) {
    // TODO inclure la startDate et endDate
    data.completedAt = new Date(data.completedAt)
    const maxDate = new Date(questionSet.endDate)
    const minDate = new Date(questionSet.startDate)

    if (data.completedAt > maxDate + 60) {
      return errorResponse({
        message: "Trop tard, l'épreuve est terminée ! 😕 ",
        code: "questionSet/too-early",
      })
    } else if (data.completedAt < minDate) {
      return errorResponse({
        message: "Trop tôt, l'épreuve commence bientôt ! 🤗",
        code: "questionSet/too-early",
      })
    }
  }
  /** ************** GET DATAS ****************/

  const deviceIdIdenticalCount = await Game.fetchDeviceIdIdenticalCount({ deviceId, challengeId, questionSetId: questionSet.id, playerId: player.id })
  if (deviceIdIdenticalCount > 0) {
    if (deviceIdIdenticalCount >= ANTI_CHEAT_LIMIT) {
      const warning = {
        title: "Avertissement",
        message: WARNING_ANTI_CHEAT_TITLE + " " + WARNING_ANTI_CHEAT_MESSAGE,
        code: "anti-cheat/forbidden",
      }
      return errorResponse({
        message: warning.message,
        code: "anti-cheat/forbidden",
      })
    }
  }

  let progression
  if (questionSet.keepProgression) {
    const totalCorrectCount = questionSet.questionCount - data.questionCount + data.correctCount
    progression = totalCorrectCount / questionSet.questionCount
  } else {
    progression = data.correctCount / data.questionCount
  }

  const game = {
    ...objectSubset(data, ["answers", "answerCount", "challengeId", "completedAt", "duration", "deviceId", "publicIp", "endOfTime", "triedToCheat", "hasQuit", "correctCount", "questionCount", "unAnsweredQuestionsIds", "appVersion"]),
    startedAt: data.startedAt ? new Date(data.startedAt) : null,
    createdAt: timestampNow,
    score: data.correctCount,
    progression,
    phase: objectSubset(phase, ["id", "name", "type"]),
    questionSet: objectSubset(questionSet, ["id", "name", "type", "questionCount", "keepProgression"]),
    team: objectSubset(team, ["id", "name"]),
    player: objectSubset(player, ["id", "username", "roles"]),
    deviceIdIdenticalCount,
  }

  const gameId = `${stringToId(player.username).substr(0, 12)}_${team.id.substr(0, 8)}_${questionSet.id.substr(0, 8)}_${nanoid(8)}`
  await db.collection("challenges").doc(challengeId).collection("games").doc(gameId).set(game)
  debug(`>GAME CREATED ${game.player.username} (${game.player.id}) (${game.team.id}) : ${game.correctCount}/${game.questionCount} pts - ${game.questionSet.name} (gameId : ${gameId})`)

  const isProgression = [ACTIVITY_TYPES.TRAINING, ACTIVITY_TYPES.ICEBREAKER, ACTIVITY_TYPES.DEBRIEFING].includes(questionSet.type)

  /// /////////////// UPDATE PLAYER ///////////////////

  let stats = {}
  stats = {
    gameCount: FieldValue.increment(1),
    [`games.${phase.id}.${questionSet.type}s.${questionSet.id}._count`]: FieldValue.increment(1),
    [`games.${phase.id}.${questionSet.type}s.${questionSet.id}.name`]: questionSet.name,
    [`games.${phase.id}.${questionSet.type}s._count`]: FieldValue.increment(1),
    [`${questionSet.type}Count`]: FieldValue.increment(1),
  }

  const hookWillUpdateTeamScores = isProgression || topPlayers

  await participateToActivity({
    activitiesTypeKey: `${questionSet.type}s`,
    activityId: questionSet.id,
    challengeId,
    multipleParticipation: isProgression,
    score: questionSet.type === ACTIVITY_TYPES.CONTEST ? game.score : null,
    phaseId: phase.id,
    playerId: player.id,
    teamId: team.id,
    hookWillUpdateTeamScores,
    hookBeforeUpdate: async ({ alreadyParticipe, oldPlayer, newPlayer, newPlayerScoresObject, newTeam, oldTeam, oldActivityStats, oldActivityTypeStats, scoreCanBeUpdated, setParticipation }) => {
      if (deviceIdIdenticalCount) {
        newPlayer.deviceIdIdenticalCount = deviceIdIdenticalCount
      }
      // newPlayer['appVersion'] = data.appVersion
      newPlayer[`${questionSet.type}Count`] = FieldValue.increment(1)
      newPlayer.gameCount = FieldValue.increment(1)

      if (!alreadyParticipe) {
        stats[`games.${phase.id}.${questionSet.type}s.${questionSet.id}._uniqueCount`] = FieldValue.increment(1)
      }

      const updateTeamScores = () => {
        const players = oldTeam.players
        const playerScores = players[player.id]?.scores || {}
        players[player.id].scores = merge(playerScores, newPlayerScoresObject)
        const teamScores = getTeamScoresForPhase({ phaseId: phase.id, players, topPlayers })
        newTeam[`scores.${phase.id}`] = teamScores
        newTeam[`${questionSet.type}Count`] = FieldValue.increment(1)
      }

      if (isProgression) {
        if (game.progression == 1) {
          stats[`games.${phase.id}.${questionSet.type}s.${questionSet.id}._completed`] = FieldValue.increment(1)
        }

        if (oldActivityStats?.progression && oldActivityStats?.progression >= game.progression) return

        if (!(questionSet.audienceRestricted && questionSet.type === ACTIVITY_TYPES.TRAINING)) {
          /// /BEGIN Calcul progression par phase
          const oldActivityTypeProgression = oldActivityTypeStats?.progression || 0
          const possibleParticipationCount = questionSet.type === ACTIVITY_TYPES.TRAINING ? phase.trainingCount : questionSet.type === ACTIVITY_TYPES.ICEBREAKER ? 1 : questionSet.type === ACTIVITY_TYPES.DEBRIEFING ? oldPlayer.scores?.[phase.id]?.contests?._stats.count || 1 : 0

          const activityProgressionInPhase = game.progression / possibleParticipationCount
          let newActivityTypeProgression = (oldActivityTypeProgression * 10 + activityProgressionInPhase * 10) / 10
          if (alreadyParticipe) {
            const oldActivityProgression = oldActivityStats?.progression ? (oldActivityStats?.progression * 10) / (phase.trainingCount * 10) : 0
            newActivityTypeProgression -= oldActivityProgression
          }
          const activityTypeValue = newActivityTypeProgression ? Math.round(newActivityTypeProgression * 100) / 100 : 0
          // END Calcul progression par phase

          setParticipation({
            key: "progression",
            value: game.progression,
            activityTypeValue,
            returnPreview: true,
            updatePhaseScore: false,
          })
        }
        updateTeamScores()
      } else if (scoreCanBeUpdated) {
        setParticipation({
          key: "errorCount",
          increment: game.answerCount - game.correctCount,
        })

        setParticipation({
          key: "questionCount",
          increment: game.questionCount,
        })

        if (topPlayers) {
          updateTeamScores()
        }
      }
    },
  })

  await ChallengeSettings.updateStats({ teamId: team.id, challengeId }, stats)

  return successResponse()
})
