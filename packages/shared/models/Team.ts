import firebase from "firebase/app"
import "firebase/firestore"
import { fetchListRef } from "../api/helpers"
import { ROLES } from "../constants"
import FirebaseObject from "./FirebaseObject"
import Image from "./Image"
import Player from "./Player"
import { callApi } from "@maracuja/shared/helpers"
const parseDate = (object, key) => {
  const prop = object[key]
  if (prop?.toDate && typeof prop.toDate === "function") {
    object[key] = prop.toDate()
  }
}
class Team extends FirebaseObject {
  // static documentPath ({ challengeId, id }) { return `challenges/${challengeId}/teams/${id}` }
  static collectionPath({ challengeId }) {
    return `challenges/${challengeId}/teams`
  }
  collectionPath() {
    return `challenges/${this.challengeId}/teams`
  }

  constructor(props) {
    super(props)
    Object.assign(this, props)

    if (props) {
      props.players && (this.players = Object.keys(props.players).map((key) => new Player(props.players[key])))
      if (props.members) {
        this.members = Object.keys(props.members)
          .map((key) => {
            const m = props.members[key]
            m.id = key
            return m
          })
          .sort((a, b) => {
            const valueA = a.firstName || a.username
            const valueB = b.firstName || b.username
            if (valueA < valueB) return -1
            else if (valueA > valueB) return 1
            return -1
          })
      }
      parseDate(props, "createdAt")

      this.colors = props.colors || { primary: "#FD4E26", secondary: "#FEDB41" }
      props.logo && (this.logo = new Image(props.logo))
    }
  }

  hasDefautName() {
    return !!this.name.match(/Équipe \d/g) || !!this.name.match(/Aucun nom/g)
  }

  sortedPlayers({ currentPhaseId }) {
    if (!this.players) return []
    return this.players
      .sort((a, b) => {
        const usernameA = a.username?.toLowerCase()
        const usernameB = b.username?.toLowerCase()
        if (usernameA < usernameB) return -1
        else if (usernameA > usernameB) return 1
        return -1
      })
      .sort((a, b) => {
        const scoreA = a.scores?.[currentPhaseId]?._stats?.score || 0
        const scoreB = b.scores?.[currentPhaseId]?._stats?.score || 0
        return scoreA > scoreB ? -1 : scoreA > scoreB ? 1 : 0
      })
  }

  scoresForPhase({ phaseId, isRankingScore = false }) {
    if (!phaseId) return
    return isRankingScore ? this.scores : this.scores?.[phaseId]
  }

  scoreForPhase({ phaseId, isRankingScore = false, metric = "score" }) {
    const scores = this.scoresForPhase({ phaseId, isRankingScore })
    let result = metric === "progression" ? "0%" : "0"
    if (phaseId && scores) {
      if (metric === "progression") {
        const progression = scores.trainings?._stats?.progression
        result = progression ? Math.round(progression * 100) + "%" : "0 %"
      } else if (metric === "score") {
        result = scores._stats?.score || 0
      }
    }
    return result
  }

  generateCard() {
    const params = {
      challengeId: this.challengeId,
      teamId: this.id,
    }
    return callApi("apiGenerateImagePlayerCard", params).then((result) => {
      return result
    })
  }

  ideaCount() {
    return this.scores?.ideasBoxes?._stats?.count
  }


  captainIds(excludedId: string) {
    const captains = []
    for (const [key] of Object.entries(this.players)) {
      const player = this.players[key]
      if (player.roles?.includes(ROLES.CAPTAIN) && player.id !== excludedId) {
        captains.push(player.id)
      }
    }
    return captains
  }

  static motivatePlayers(data) {
    return callApi("apiPlayersMotivate", data)
  }

  static create({ id, challengeId }, { name, organisationId, fromExistingClub, currentPhaseId }) {
    return callApi("apiTeamsCreate", {
      name,
      organisationId,
      id,
      challengeId,
      fromExistingClub,
      currentPhaseId
    })
  }

  static generate({ clubsCount, namingType, challengeId, organisationId, haveToCreateMaracujaTeam }) {
    return callApi("apiTeamsGenerateClubs", {
      clubsCount,
      namingType,
      challengeId,
      organisationId,
      haveToCreateMaracujaTeam,
    })
  }
  // Challenges/clubs
  // static fetch ({ challengeId, id, listener }) {
  //   const teamRef = firebase.firestore().doc(`challenges/${challengeId}/teams/${teamId}`)
  //   return fetchRef(teamRef, {
  //     listener,
  //     initializer: (data) => new Team(data)
  //   })
  // }

  // static async update ({ challengeId, id, data }) {
  //   return await super.update({
  //     challengeId,
  //     id,
  //     ...data,
  //     lastActionAt: firebase.firestore.Timestamp.fromDate(new Date())
  //   })
  // }

  // static fetchAll ({ challengeId, limit }) {
  //   const ref = firebase.firestore().collection(`challenges/${challengeId}/teams`)
  //     .orderBy('createdAt', 'desc')
  //     .limit(limit)
  //   return fetchListRef(ref, { initializer: (data) => new Team(data) })
  // }
}

export default Team
