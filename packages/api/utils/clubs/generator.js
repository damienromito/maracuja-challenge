const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { authOnCall } = require("../../utils/functions")
const { Challenge, Team, Club, ChallengeSettings } = require("../../models")
const { MARACUJA_CLUB_ID } = require("../../constants")
const { successResponse } = require("../response")

const timestamp = admin.firestore.Timestamp

const CLUB_COUNT_MAX = 19
const generateClubs = async ({ clubsCount, namingType, challengeId, organisationId, haveToCreateMaracujaTeam }) => {
  const challenge = await Challenge.fetch({ id: challengeId })
  let firstPhase = challenge.getPhases()?.[0]

  if (haveToCreateMaracujaTeam) {
    const maracujaTeam = await Club.fetch({ id: MARACUJA_CLUB_ID })
    await Team.createFromClub(maracujaTeam, {
      challengeId,
      teamId: MARACUJA_CLUB_ID,
      // currentPhaseId: firstPhase?.id, To delete ?
      // startDate: firstPhase?.startDate, To delete ?
    })
  }

  if (!clubsCount) return

  //TODO get names and logo from already created teams

  let alreadyUsedNames = new Map()
  let alreadyUsedLogo = new Map()
  const getRandomValue = (type) => {
    let randomIndex = Math.floor(Math.random() * CLUB_COUNT_MAX)
    if (type === "name") {
      return getUniqueTeamValue(randomIndex, defaultTeamNames, alreadyUsedNames)
    } else if (type === "logo") {
      return getUniqueTeamValue(randomIndex, defaultTeamLogoUrl, alreadyUsedLogo)
    }
  }

  const getUniqueTeamValue = (index, listValue, alreadyUsedMap) => {
    const value = listValue[index]
    if (alreadyUsedMap.has(value)) {
      index++
      if (index === CLUB_COUNT_MAX) index = 0
      return getUniqueTeamValue(index, listValue, alreadyUsedMap)
    } else {
      alreadyUsedMap.set(value)
      return value
    }
  }

  if (clubsCount > CLUB_COUNT_MAX) {
    clubsCount = CLUB_COUNT_MAX
  }
  const promises = []
  for (let i = clubsCount; i > 0; i--) {
    //namingTypes random / unamed
    const teamName = namingType === "unamed" ? `Équipe ${i}` : getRandomValue("name")

    const promise = Team.createWithNewClub(
      { challengeId, id: null },
      {
        name: teamName,
        logo: { original: getRandomValue("logo") },
        organisationId,
        lastActionAt: timestamp.now(),
        lastActionPhaseId: firstPhase?.id,
      }
    )
    promises.push(promise)
  }
  await Promise.all(promises)

  return successResponse()
}

const defaultTeamNames = ["Les Déterminés", "Les Audacieux", "Les Inouïs", "Les Phénoménales", "Les Fantastiques", "Les Prodigieux", "Les Magnifiques", "Les Stupéfiants", "Les Remarquables", "Les Ambitieux", "Les Fabuleux", "Les Authentiques", "Les Sensationnels", "Les Admirables", "Les Optimistes", "Les Merveilleux", "Les Persévérants", "Les Éblouissants", "Les Téméraires", "Les Aventuriers"]
// const defaultTeamAdjectiveNames = ["déterminés", "audacieux", "inouïs", "phénoménales", "fantastiques", "prodigieux", "magnifiques", "stupéfiants", "remarquables", "ambitieux", "fabuleux", "authentiques", "sensationnels", "admirables", "optimistes", "merveilleux", "persévérants", "éblouissants", "téméraires", "aventuriers"]
// const defaultTeamPetNames = ["Les hiboux",  ]
const defaultTeamLogoUrl = [
  "https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/placeholder%2Fteams%2FProperty%201%3Dhibou.png?alt=media&token=421c8ef9-d389-4df1-95c9-be034e9cbbd3",
  "https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/clubs%2Flesdtermins_organisationsId_RNv6sJkq%2Flogo.png?alt=media&token=8d61dffe-d6a5-4751-8e28-362d1aacd60b",
  "https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/placeholder%2Fteams%2FProperty%201%3DVariant13.png?alt=media&token=d8beee11-b1e7-4d1c-b08c-50d14a0827cb",
  "https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/placeholder%2Fteams%2FProperty%201%3DVariant14.png?alt=media&token=32beb040-0237-466b-8d68-fe620cb3deb4",
  "https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/placeholder%2Fteams%2FProperty%201%3DVariant15.png?alt=media&token=422a3137-d2b0-43bd-b6d3-e1358660166d",
  "https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/placeholder%2Fteams%2FProperty%201%3DVariant16.png?alt=media&token=c5455ecb-8770-48cd-94c4-e01e0f456181",
  "https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/placeholder%2Fteams%2FProperty%201%3DVariant17.png?alt=media&token=36751010-835f-4159-ae65-9efdc763fc33",
  "https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/placeholder%2Fteams%2FProperty%201%3DVariant18.png?alt=media&token=579ba12a-9a82-48b3-b423-497e94fcf30f",
  "https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/placeholder%2Fteams%2FProperty%201%3DVariant19.png?alt=media&token=1c46a3f4-c549-46ac-af72-1a2c776c5733",
  "https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/placeholder%2Fteams%2FProperty%201%3DVariant20.png?alt=media&token=a8ee6a65-9a6b-4c60-aa51-0c404b8bbab1",
  "https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/placeholder%2Fteams%2FProperty%201%3DVariant21.png?alt=media&token=af21cb04-6a54-424f-a6e3-ac52c970ce1e",
  "https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/placeholder%2Fteams%2FProperty%201%3DVariant22.png?alt=media&token=0e67edde-e229-4995-8069-d95a6a85d593",
  "https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/placeholder%2Fteams%2FProperty%201%3DVariant23.png?alt=media&token=b891740d-6798-4511-93f4-509c56b8d298",
  "https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/placeholder%2Fteams%2FProperty%201%3DVariant24.png?alt=media&token=26a23e47-d850-4d1e-9222-70cafbebea2e",
  "https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/placeholder%2Fteams%2FProperty%201%3DVariant27.png?alt=media&token=dccfdf00-f8a1-4304-8fda-a11651243d3f",
  "https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/placeholder%2Fteams%2FProperty%201%3DVariant28.png?alt=media&token=34afd1b5-4d3c-43fc-9c1a-a86def9c7f99",
  "https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/placeholder%2Fteams%2FProperty%201%3DVariant29.png?alt=media&token=45abd784-e7c3-44d7-a339-d53109d39227",
  "https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/placeholder%2Fteams%2FProperty%201%3DVariant30.png?alt=media&token=fc8e25b4-93d1-40ea-84bd-af767920924b",
  "https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/placeholder%2Fteams%2FProperty%201%3DVariant31.png?alt=media&token=df3f50d1-3f84-498d-989b-f75f0a58a544",
]

// "https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/placeholder%2Fteams%2FProperty%201%3DVariant25.png?alt=media&token=777d6bd4-be68-494f-bfc2-e5e32a1453a7",
module.exports = {
  generateClubs,
}
