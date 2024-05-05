const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { getAction, isPropDirty, isPropsDirty, objectSubset, objectFromChangeProps } = require("../../utils")

const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { fetchChallengeDynamicLinkInfo } = require("../../utils/challenges/dynamicLink")
const { Challenge, ChallengeSettings } = require("../../models")
const fieldValue = admin.firestore.FieldValue
const db = admin.firestore()

exports = module.exports = functions.firestore.document("challenges/{challengeId}").onWrite(async (change, context) => {
  const challengeId = context.params.challengeId
  const [action, oldDocument, newDocument] = getAction(change)

  if (action === "delete") return

  if (action === "update") {
    await updateDynamicLinks(change, challengeId)
  }

  // CGALL
  if (isPropDirty("highlighted", oldDocument, newDocument)) {
    const publicChallengesRef = db.collection("stats").doc("publicChallenges")
    const newPublicChallenge = {}
    if (newDocument.highlighted) {
      newPublicChallenge[challengeId] = objectSubset(newDocument, ["name", "image", "periodString", "startDate", "endDate", "editionName"])
    } else {
      newPublicChallenge[challengeId] = fieldValue.delete()
    }
    await publicChallengesRef.update(newPublicChallenge)
  }
  // else if(newDocument.highlighted){
  //     const challenge = objectFromChangeProps({change, props : [
  //         'name',
  //         'image',
  //         'periodString',
  //         'startDate',
  //         'endDate'
  //     ]})
  // }

  //Oraganisation preview
  if (newDocument.organisationsIds?.length > 0) {
    newDocument.organisationsIds.forEach(async (organisationId) => {
      const props = ["name", "image", "periodString", "startDate", "endDate", "hidden", "code", "scenarioType", "trainingActions", "editionName"]
      const organisationRef = db.collection("organisations").doc(organisationId)
      const newChallenge = objectFromChangeProps({ change, props })
      if (Object.keys(newChallenge).length > 0) {
        const newOrganisation = {}
        newOrganisation[`challenges.${challengeId}`] = objectSubset(newDocument, props)
        await organisationRef.update(newOrganisation)
      }
    })
  }

  //settings/ranking
  if (isPropsDirty(change, ["endDate", "startDate", "name", "topPlayers", "topPlayersEnabled"])) {
    await ChallengeSettings.update(
      { challengeId, id: "ranking" },
      {
        challenge: {
          id: challengeId,
          ...objectSubset(newDocument, ["endDate", "startDate", "name"]),
        },
        ...objectSubset(newDocument, ["topPlayers", "topPlayersEnabled"]),
      }
    )
  }

  return null
})

const updateDynamicLinks = async (change, challengeId) => {
  const [action, oldDocument, newDocument] = getAction(change)

  const challengeUpdates = {}
  const checkAndUpdate = async (challengeProp) => {
    if (!isPropsDirty(change, [`${challengeProp}.title`, `${challengeProp}.image`])) {
      return false
    }

    const dynamicLink = await fetchChallengeDynamicLinkInfo({
      challengeId,
      webAppEnabled: newDocument.webAppEnabled,
      ...objectSubset(newDocument[challengeProp], ["title", "image", "message"]),
    })
    challengeUpdates[`${challengeProp}.link`] = dynamicLink.link
    challengeUpdates[`${challengeProp}.code`] = dynamicLink.code
    return true
  }

  const dynamicLinkUpdated = await checkAndUpdate("dynamicLink")
  const dynamicLinkReferralUpdated = await checkAndUpdate("dynamicLinkReferral")

  if (dynamicLinkUpdated || dynamicLinkReferralUpdated) {
    return Challenge.update({ id: challengeId }, challengeUpdates)
  }
  return true
}
