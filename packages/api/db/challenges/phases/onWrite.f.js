const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { getAction, objectSubset, isPropsDirty } = require("../../../utils")

const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { Challenge, ChallengeSettings } = require("../../../models")
const { updatePhaseRankings } = require("../../../utils/phases")
const fieldValue = admin.firestore.FieldValue
const timestamp = admin.firestore.Timestamp

exports = module.exports = functions.firestore.document("challenges/{challengeId}/phases/{phaseId}").onWrite(async (change, context) => {
  const challengeId = context.params.challengeId
  const phaseId = context.params.phaseId
  const [action, oldDocument, newDocument] = getAction(change)
  debug("Update phase " + phaseId, newDocument)

  if (action === "delete") return

  //challenge/
  const propsToUpdateChallenge = [
    "captainEditTeam",
    "description",
    // 'displayedFilter',
    "endDate",
    "name",
    "priceCount",
    "holdAuthorizedClubs",
    "trainingCount",
    // 'contestCount',
    "ranking",
    // 'rankingFilters',
    "rankingStats",
    "isFinale",
    "signupDisabled",
    "startDate",
    "type",
  ]
  if (isPropsDirty(change, propsToUpdateChallenge)) {
    const update = {
      [`phases.${phaseId}`]: objectSubset(newDocument, propsToUpdateChallenge),
    }
    await Challenge.update({ id: challengeId }, update)
  }

  //settings/ranking
  const propsToUpdateSettingsRanking = ["rankingFilters", "startDate", "endDate", "displayedFilter"]
  if (isPropsDirty(change, propsToUpdateSettingsRanking)) {
    const update = {
      [`phases.${phaseId}`]: objectSubset(newDocument, propsToUpdateSettingsRanking),
    }
    await ChallengeSettings.update({ challengeId, id: "ranking" }, update)
    if (newDocument.endDate > timestamp.now()) {
      await updatePhaseRankings({ phaseId, challengeId })
    }
  }
  return true
})
