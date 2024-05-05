const { objectSubset, firestoreTimestampFromData } = require("../../utils")
const admin = require("firebase-admin")
const db = admin.firestore()
const timestamp = admin.firestore.Timestamp
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { cpus } = require("os")
const { fetchListRef } = require("../firebase")
const { fetchRef } = require("../../models/FirebaseObject")
const { Team } = require("../../models")

const createPhaseRankings = async ({ challengeId, audienceFilters, phase, previousPhase, teamsToDisplay }) => {
  const initialRanking = {
    createdAt: phase.startDate,
    editedAt: phase.startDate,
    phase: objectSubset(phase, ["id", "name", "displayedFilter", "rankingFilters", "type", "priceCount"]),
    phaseId: phase.id,
    challengeId,
  }

  const rankingFilters = phase.rankingFilters

  let teams
  if (previousPhase) {
    const newDisplayedFilter = phase.displayedFilter
    teams = await fetchTeamsFromPhase({ challengeId, phase: previousPhase, rankingFilters, newDisplayedFilter })
  } else if (teamsToDisplay) {
    teams = teamsToDisplay
  }

  const newRankings = getRankings({
    rankingFilters,
    phaseId: phase.id,
    holdAuthorizedClubs: previousPhase?.holdAuthorizedClubs,
    audienceFilters,
    teams,
    priceCount: previousPhase?.priceCount,
  })

  const createRankingByFilterValue = async (index = 0) => {
    const ranking = { ...initialRanking, ...newRankings[index] }

    const params = { challengeId, ranking, rankingId: ranking.id }

    await createRanking(params)

    if (index < newRankings.length - 1) {
      return createRankingByFilterValue(index + 1)
    }
  }
  await createRankingByFilterValue()
}

const getRankings = ({ phaseId, audienceFilters, rankingFilters, teams, priceCount, holdAuthorizedClubs }) => {
  if (!rankingFilters?.length || !audienceFilters) {
    const ranking = { id: phaseId }
    if (teams) {
      if (priceCount || holdAuthorizedClubs) {
        ranking.authorizedClubs = teams.map((team) => team.id)
      }
      ranking.teams = teams
    }
    return [ranking]
  } else {
    const rankingFilter = rankingFilters && rankingFilters[0] // TODO SEVERAL FILTERS  //ça foncionne different pour departement et region qui sont intrinsequement lié

    const mainRankingFilterValues = audienceFilters[rankingFilter]
    return mainRankingFilterValues.map((filterValue) => {
      const ranking = { id: phaseId + "-" + filterValue.id }
      if (teams) {
        const rankingTeams = teams.filter((team) => team[rankingFilter].id === filterValue.id)
        ranking.teams = rankingTeams
        if (priceCount || holdAuthorizedClubs) {
          ranking.authorizedClubs = rankingTeams.map((team) => team.id)
        }
      }
      ranking[rankingFilter] = filterValue

      if (rankingFilter === "department") {
        ranking.region = audienceFilters.region.find((r) => r.code === filterValue.region_code)
      }
      return ranking
    })
  }
}

const fetchTeamsFromPhase = async ({ challengeId, phase, rankingFilters, newDisplayedFilter }) => {
  const rankingFilter = rankingFilters ? rankingFilters[0] : null

  // const rankingsRef = db.collection("challenges")
  //   .doc(challengeId).collection("rankings").doc('echauffementrgional_k-iG-corse')
  // const ranking = await fetchRef(rankingsRef)
  // const rankings = [ranking]
  const rankingsRef = db.collection("challenges").doc(challengeId).collection("rankings").where("phase.id", "==", phase.id)
  const rankings = await fetchListRef(rankingsRef)
  const teams = []

  // GET TEAMS FROM PREVIOUS RANKINGS
  const priceCount = phase.priceCount || 0
  // const filterKey = rankingFilter ? `${rankingFilter}Id` : null //IF PHASE FILTRED (by tribe, dep or region)
  rankings &&
    rankings.forEach((ranking) => {
      if (!ranking.teams || !ranking.teams.length) return
      const displayedFilterValue = newDisplayedFilter && ranking[newDisplayedFilter] ? ranking[newDisplayedFilter].name : null
      // const rankingFilterValue = rankingFilter ? ranking[rankingFilter] : null
      const rankingFiltersValues = {}
      rankingFilters?.forEach((rankingFilterKey) => {
        rankingFiltersValues[rankingFilterKey] = ranking[rankingFilterKey]
        if (rankingFilterKey === "department") {
          rankingFiltersValues.region = ranking.region
        }
      })

      // const maxTeamCount = priceCount ? (priceCount > ranking.teams.length ? ranking.teams.length : priceCount) : ranking.teams.length
      for (let index = 0; index < ranking.teams.length; index++) {
        // for(index = 0; index < maxTeamCount; index ++){
        const currentTeam = ranking.teams[index]

        if (priceCount && (!currentTeam.scores?._stats?.score || currentTeam.scores?._stats?.score == 0)) {
          // SI PAS JOUE OU ZERO POINTS
          break
        }

        const team = {
          ...currentTeam,
          ...rankingFiltersValues,
        }
        team.scores = { _stats: { score: 0, count: 0 } }
        team.displayedFilter = displayedFilterValue || null
        teams.push(team)

        if (priceCount && index >= priceCount - 1) {
          const nextTeam = ranking.teams[index + 1]
          // SI EX EAQUO SUAF SI SCORE = ZERO
          if (!nextTeam || currentTeam.scores?._stats?.score !== nextTeam.scores?._stats?.score) {
            break
          }
        }
      }
    })

  return teams.sort((a, b) => {
    if (a.name < b.name) return -1
    else if (a.name > b.name) return 1
    return -1
  })
}

const createRanking = async ({ rankingId, challengeId, ranking }) => {
  const rankingRef = db.collection("challenges").doc(challengeId).collection("rankings").doc(rankingId)
  try {
    await rankingRef.set(ranking, { merge: true })
  } catch (err) {
    error("error creation ranking", err)
  }
}

module.exports = {
  createPhaseRankings,
}
