import { callApi, objectSubset } from "@maracuja/shared/helpers"
import "firebase/firestore"
import { fetchRef, getRankingId } from "../api/helpers"
import { MARACUJA_TEAM_ID } from "../constants"
import FirebaseObject from "./FirebaseObject"
import Team from "./Team"

class Ranking extends FirebaseObject {
  static collectionPath({ challengeId }) {
    return `challenges/${challengeId}/rankings`
  }
  collectionPath() {
    return `challenges/${this.challengeId}/rankings`
  }

  constructor({ data, phasePriceCount, currentTeam, displayMaracujaTeam }) {
    super(data)
    if (this.authorizedClubs && !this.authorizedClubs.includes(currentTeam.id)) {
      this.currentTeamSelected = false
    } else {
      this.currentTeamSelected = true
    }

    if (this.phase && this.teams) {
      // DEFAULT LOGO
      const teams = []
      this.teams.forEach((team) => {
        if (team.id !== MARACUJA_TEAM_ID || displayMaracujaTeam) {
          teams.push(new Team(team))
        }
      })

      this.teams = teams
      // CLUB SELECTED
      if (currentTeam && this.currentTeamSelected) {
        // ACTIVETEAM ACTIVE_RANKING
        const teamIndex = this.teams.findIndex((item) => item.id === currentTeam.id)
        if (teamIndex > -1) {
          this.currentTeamRank = teamIndex + 1
          this.currentTeamisSelected = (phasePriceCount || 0) > this.currentTeamRank
        } else {
          this.currentTeamRank = this.teams.length + 1
          // this.teams.push(new Team({
          //   name: currentTeam.name,
          //   logo: currentTeam.logo,
          //   score: { top: 0, total: 0 },
          //   id: currentTeam.id
          // }))
        }
      }

      const priceCount = this.phase.priceCount
      let prizedDisabled = false
      if (priceCount) {
        this.teams = this.teams.map((team, index) => {
          const teamScore = team.scores?._stats?.score || 0
          if (index >= priceCount && (prizedDisabled || this.teams[index - 1].scores?._stats?.score !== teamScore)) {
            team.prized = false
            prizedDisabled = true
          } else if (teamScore !== 0) {
            team.prized = true
          }
          return team
        })
      }
    }
  }

  static fetch({ challengeId, phase, team = undefined, rankingId = undefined, displayMaracujaTeam = false }, options = { listener: null }) {
    if (!rankingId) {
      rankingId = getRankingId(phase, team)
    }
    const currentTeam = team ? objectSubset(team, ["name", "image", "id"]) : null
    const phasePriceCount = phase?.priceCount
    return super.fetch(
      {
        challengeId,
        id: rankingId,
      },
      {
        listener: options.listener,
        initializer: (data) => new Ranking({ data, phasePriceCount, currentTeam, displayMaracujaTeam }),
        defaultValue: { teams: [] },
      }
    )
  }

  static fetchAll({ challengeId, phaseId }) {
    const ref = this.collectionRef({ challengeId })
    return ref
      .where("phaseId", "==", phaseId)
      .get()
      .then((snapshots) => {
        const rankings = []
        snapshots.docs.forEach((x, index) => {
          const data = x.data()
          if (data.regionId === "autre") return
          rankings.push({ ...data, id: x.id })
        })
        return rankings
      })
  }

  // static startPhase (params = { challengeId: null, phaseId: null, topPlayers: null, previousPhaseId: null }) {
  //   return callApi('apiPhasesStart', params)
  // }
}

export default Ranking
