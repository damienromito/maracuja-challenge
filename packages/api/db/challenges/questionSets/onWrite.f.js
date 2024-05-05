const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { objectSubset, getAction, isPropDirty, isPropsDirty } = require("../../../utils")
const { Challenge, Phase, Notification, ChallengeSettings } = require("../../../models")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { ACTIVITY_TYPES } = require("../../../constants")
const { manageGeneratedNotifications } = require("./generatedNotifications")

const fieldValue = admin.firestore.FieldValue
const db = admin.firestore()

exports = module.exports = functions.firestore.document("challenges/{challengeId}/questionSets/{questionSetId}").onWrite(async (change, context) => {
  const [action, oldDocument, newDocument] = getAction(change)

  const challengeId = context.params.challengeId
  const questionSetId = context.params.questionSetId
  const challengeRef = db.collection("challenges").doc(challengeId)
  const phasesRef = db.collection(`challenges/${challengeId}/phases/`)

  // DELETE
  if (action === "delete") {
    await deleteQuestionSetInChallenge({
      questionSetId,
      oldDocument,
      phasesRef,
      challengeId,
    })
    return
  }

  // ICE BREAKER
  if (newDocument.type === ACTIVITY_TYPES.ICEBREAKER) {
    return
  }
  const newPhase = {}

  if (newDocument.disabled) {
    if (!oldDocument?.disabled) {
      deleteQuestionSetInChallenge({
        questionSetId,
        oldDocument,
        phasesRef,
        challengeId,
      })
    }
    return
  } else if (oldDocument?.disabled && !newDocument.disabled) {
    newPhase[`${oldDocument.type}Count`] = fieldValue.increment(1)
  }

  if (oldDocument?.authorizedTeams && isPropDirty("authorizedTeams", oldDocument, newDocument)) {
    if (oldDocument.authorizedTeams.length && !newDocument.authorizedTeams?.length) {
      // increment
      newPhase[`${oldDocument.type}Count`] = fieldValue.increment(1)
    } else if (!oldDocument.authorizedTeams.length && newDocument.authorizedTeams?.length) {
      // decrement
      newPhase[`${oldDocument.type}Count`] = fieldValue.increment(-1)
    }
  }

  // GENERATE NOTIFICATIONS
  if (isPropsDirty(change, ["endDate", "startDate", "duration"]) && !newDocument.disabled) {
    await manageGeneratedNotifications({
      questionSet: newDocument,
      challengeId,
      questionSetId,
    })
  }

  // INCREMENT LE COUNT DANS LA PHASE
  if (isPropDirty("type", oldDocument, newDocument) && !newDocument?.authorizedTeams?.length) {
    newPhase[`${newDocument.type}Count`] = fieldValue.increment(1)
    if (oldDocument) {
      newPhase[`${oldDocument.type}Count`] = fieldValue.increment(-1)
    }
  }
  if (Object.keys(newPhase).length) {
    await phasesRef.doc(newDocument.phase.id).update(newPhase)
  }

  // UPDATE CHALLENGE
  //TODO CHECK USELESS UPDATE (if any of below properties updated)
  const values = objectSubset(newDocument, ["displayBadge", "startDate", "endDate", "name", "phaseId", "phase", "type", "activities", "questionCountMax", "authorizedTeams", "audienceRestricted", "debriefingDisabled", "notifications", "emailReportSent"])
  const newQuestionSet = {}
  newQuestionSet[`questionSets.${questionSetId}`] = {
    ...values,
    questionCount: (newDocument.questions && newDocument.questions.length) || 0,
  }
  await challengeRef.update(newQuestionSet)
})

const deleteQuestionSetInChallenge = async ({ questionSetId, oldDocument, challengeId, phasesRef }) => {
  const newQuestionSet = {}
  newQuestionSet[`questionSets.${questionSetId}`] = fieldValue.delete()
  await Challenge.update({ id: challengeId }, newQuestionSet)

  oldDocument.generatedNotifications

  const promises = []
  for (const key in oldDocument.generatedNotifications) {
    const id = oldDocument.generatedNotifications[key].id
    if (id) {
      promises.push(Notification.delete({ challengeId, id }))
    }
  }
  await Promise.all(promises)

  if (!oldDocument?.authorizedTeams?.length) {
    await Phase.update({ challengeId, id: oldDocument.phase.id }, { [`${oldDocument.type}Count`]: fieldValue.increment(-1) })
  }

  const newStats = {
    [`questionSets.${questionSetId}`]: fieldValue.delete(),
  }
  await ChallengeSettings.updateStats({ challengeId }, newStats)
}
