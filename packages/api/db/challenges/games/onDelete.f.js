const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { cp } = require("fs")
const { ACTIVITY_TYPES } = require("../../../constants")
const { Player, Team } = require("../../../models")
const fieldValue = admin.firestore.FieldValue

exports = module.exports = functions.firestore.document("challenges/{challengeId}/games/{gameId}").onDelete(async (snap, context) => {
  const game = snap.data()
  const challengeId = context.params.challengeId
  let newPlayer = {
    [`scores.${game.phase.id}.${game.questionSet.type}s.${game.questionSet.id}`]: fieldValue.delete(),

    [`${game.questionSet.type}Count`]: fieldValue.increment(-1),
    [`gameCount`]: fieldValue.increment(-1),
  }

  if (game.questionSet.type === ACTIVITY_TYPES.CONTEST) {
    const score = game.correctCount
    const errorCount = game.answerCount - game.correctCount
    newPlayer = {
      ...newPlayer,
      [`scores.${game.phase.id}._stats.count`]: fieldValue.increment(-1),
      [`scores.${game.phase.id}._stats.errorCount`]: fieldValue.increment(-errorCount),
      [`scores.${game.phase.id}._stats.questionCount`]: fieldValue.increment(-game.questionCount),
      [`scores.${game.phase.id}._stats.score`]: fieldValue.increment(-score),
      [`scores.${game.phase.id}.${game.questionSet.type}s._stats.count`]: fieldValue.increment(-1),
      [`scores.${game.phase.id}.${game.questionSet.type}s._stats.score`]: fieldValue.increment(-score),
      [`scores.${game.phase.id}.${game.questionSet.type}s._stats.errorCount`]: fieldValue.increment(-errorCount),
      [`scores.${game.phase.id}.${game.questionSet.type}s._stats.questionCount`]: fieldValue.increment(-errorCount),
    }
  }

  await Player.update({ challengeId, id: game.player.id }, newPlayer)

  // const pathPlayerInTeam = `players.${playerId}`
  // const newTeam = {
  //   [`${pathPlayerInTeam}.scores.${game.phase.id}.${game.questionSet.type}s.${game.questionSet.id}`] : fieldValue.delete(),
  //   [`${pathPlayerInTeam}.${game.questionSet.type}s.${game.id}`] : fieldValue.delete(),
  //   [`${pathPlayerInTeam}.${game.questionSet.type}Count`] :  fieldValue.increment(-1),
  //   [`gameCount`] :  fieldValue.increment(-1)
  // }
  // await Team.update({challengeId, id : teamId}, newTeam)

  // let stats = {}
  // stats['gameCount'] = FieldValue.increment(-1)
  // stats[`questionSets.${questionSetId}.gameCount`] =  FieldValue.increment(-1)
})
