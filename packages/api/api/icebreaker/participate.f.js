const admin = require("firebase-admin")
const { errorResponse, successResponse } = require("../../utils/response")
const { objectSubset, stringToId } = require("../../utils")
const { ACTIVITY_TYPES, MARACUJA_CLUB_ID } = require("../../constants")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { ChallengeSettings } = require("../../models")
const { participateToActivity } = require("../../utils/activities")

const FieldValue = admin.firestore.FieldValue
const db = admin.firestore()
const { nanoid } = require("nanoid")
const { authOnCall } = require("../../utils/functions")

exports = module.exports = authOnCall({ auth: true }, async (data, context) => {
  const timestampNow = admin.firestore.Timestamp.now()
  const { questionSet, phase, challengeId, player, team } = data

  const game = {
    ...objectSubset(data, ["answers", "answerCount", "challengeId", "completedAt", "duration", "correctCount", "questionCount"]),
    startedAt: data.startedAt ? new Date(data.startedAt) : null,
    createdAt: timestampNow,
    score: data.correctCount,
    progression: data.correctCount / data.questionCount,
    phase: objectSubset(phase, ["id", "name", "type"]),
    questionSet: objectSubset(questionSet, ["id", "name", "type"]),
    team: objectSubset(team, ["id", "name"]),
    player: objectSubset(player, ["id", "username", "roles"]),
  }

  const gameId = `${stringToId(player.username).substr(0, 12)}_icebreaker_${team.id.substr(0, 8)}_${nanoid(8)}`
  await db.collection("challenges").doc(challengeId).collection("games").doc(gameId).set(game)
  debug(`>ICEBREAKER GAME CREATED ${game.player.username} (${game.player.id}) (${game.team.id}) : ${game.correctCount}/${game.questionCount} pts - ${game.questionSet.name} (gameId : ${gameId})`)

  /// /////////////// UPDATE PLAYER ///////////////////
  const stats = {
    "icebreakerGames.count": FieldValue.increment(1),
  }

  await participateToActivity({
    activitiesTypeKey: "icebreakerGames",
    activityId: ACTIVITY_TYPES.ICEBREAKER,
    challengeId,
    multipleParticipation: true,
    score: null,
    phaseId: phase.id,
    playerId: player.id,
    teamId: team.id,
    hookWillUpdateTeamScores: true,
    hookBeforeUpdate: async ({ alreadyParticipe, newPlayer }) => {
      newPlayer["icebreaker.gameCount"] = FieldValue.increment(1)
      newPlayer["icebreaker.lastQuestionCount"] = data.questionSet.questionCount
      const newProgression = Math.round(game.progression * 100) / 100
      newPlayer["icebreaker.progression"] = newProgression

      if (!alreadyParticipe) {
        stats["icebreakerGames.uniqueCount"] = FieldValue.increment(1)
      }

      // const updateTeamScores = () => {
      //   const players = oldTeam.players
      //   let playerScores = players[player.id]?.scores || {}
      //   players[player.id].scores = merge(playerScores,newPlayerScoresObject )
      //   const teamScores = getTeamScoresForPhase({phaseId : phase.id, players})
      //   newTeam[`scores.${phase.id}`] = teamScores
      //   newTeam[`${questionSet.type}Count`] =  FieldValue.increment(1)
      // }

      // setParticipation({
      //   key : 'questionCount',
      //   value : game.questionCount,
      //   updatePhaseScore : false
      // })
      // setParticipation({
      //   key : 'progression',
      //   value : game.progression,
      //   activityTypeValue : Math.round(game.progression * 100) / 100 ,
      //   updatePhaseScore : false
      // })

      // updateTeamScores()
    },
  })

  await ChallengeSettings.updateStats({ challengeId, teamId: team.id }, stats)

  return successResponse()
})
