const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { FileWatcherEventKind } = require("typescript")
const { ChallengeSettings, Ranking } = require("../../../models")

exports = module.exports = functions.firestore.document("challenges/{challengeId}/phases/{phaseId}").onDelete(async (snap, context) => {
  const FieldValue = admin.firestore.FieldValue
  const db = admin.firestore()

  const challengeId = context.params.challengeId
  const phaseId = context.params.phaseId

  let updateValue = {}
  updateValue[`phases.${phaseId}`] = FieldValue.delete()

  await db.collection("challenges").doc(challengeId).update(updateValue)

  await ChallengeSettings.update({ challengeId, id: "ranking" }, updateValue)

  const rankings = await Ranking.fetchAll({ challengeId }, { refHook: (ref) => ref.where("phase.id", "=", phaseId) })
  const promises = rankings.map((ranking) => {
    return ranking.delete()
  })

  await Promise.all(promises)

  return
})
