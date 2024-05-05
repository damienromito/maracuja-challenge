const admin = require("firebase-admin")
const { nanoid } = require("nanoid")
const { objectSubset, generateId } = require("../utils")
const Club = require("./Club")
const FirebaseObject = require("./FirebaseObject")
const Image = require("./Image")
const db = admin.firestore()

module.exports = class Team extends FirebaseObject {
  static collectionPath({ challengeId }) {
    return `challenges/${challengeId}/teams`
  }
  collectionPath() {
    return `challenges/${this.challengeId}/teams`
  }

  constructor(state) {
    super(state)
    state.logo && (state.logo = new Image(state.logo))

    if (state.members) {
      // state.members && (state.members = Object.keys(state.members).map(key => state.members[key]))
    }
    Object.assign(this, state)
  }

  // static fetch = async ({challengeId, teamId}) => {
  //   let teamRef = db.collection("challenges").doc(challengeId).collection('teams').doc(teamId)
  //   const team = await Team.fetchRef(teamRef)
  //   return team
  // }

  // static fetchAll = async ({challengeId}) => {
  //   let teamsRef = db.collection("challenges").doc(challengeId).collection('teams')
  //   const teams = await Team.fetchListRef(teamsRef)
  //   return teams
  // }

  static fetchByProperty = async ({ challengeId, propertyKey, propertyValue, returnFirstElem = true }) => {
    return await FirebaseObject.fetchByProperty({
      collectionKey: "challenges",
      collectionDocId: challengeId,
      subCollectionKey: "teams",
      propertyKey,
      propertyValue,
      returnFirstElem,
    })
  }

  static createWithNewClub = async ({ challengeId, id }, { name, organisationId, lastActionAt, lastActionPhaseId, logo }) => {
    //lastActionAt
    //lastActionPhaseId

    if (!id) {
      const preName = `${organisationId}_${nanoid(8)}`
      if (name === "Aucun nom") id = preName
      else id = generateId(name) + "_" + preName
    }

    // CRETE CLUB
    await Club.create(
      { challengeId, id },
      {
        name,
        organisationsId: [organisationId],
        logo,
      }
    )

    // CREATE TEAM
    await Team.create(
      { challengeId, id },
      {
        name,
        challengeId,
        lastActionPhaseId,
        lastActionAt,
        logo,
        playerCount: 0,
      }
    )
    return
  }

  static createFromClubId = async (clubId, { challengeId }) => {
    const club = await Club.fetch({ id: clubId })
    return Team.createFromClub(club, { challengeId, teamId: clubId })
  }

  static createFromClub = async (club, { challengeId, teamId, currentPhaseId, startDate }) => {
    const timestampNow = admin.firestore.Timestamp.now()

    const newTeam = {
      ...objectSubset(club, ["zipCode", "region", "regionId", "tribeId", "tribe", "departmentId", "department", "originId", "lastPlayerNumber", "name", "logo"]),
      challengeId,
      createdAt: timestampNow,
      lastActionAt: startDate,
      lastActionPhaseId: currentPhaseId,
      playerCount: 0,
    }
    await Team.create({ challengeId, id: teamId }, newTeam)
    return newTeam
  }
}
