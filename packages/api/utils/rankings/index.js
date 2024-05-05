const admin = require("firebase-admin")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const getTeamScoresForPhase = require("./getTeamScoresForPhase")
const { Team, Ranking, Challenge, ChallengeSettings } = require("../../models")
const { sortedDatedObjects } = require("..")
const db = admin.firestore()
const timestamp = admin.firestore.Timestamp

const calculRankingsInCurrentChallenges = async () => {
  return ChallengeSettings.fetchAllCurrentRankings({
    hook: (rankingInfo) => {
      console.log("Challenge in live : ", rankingInfo.challenge.id)
      return calculInChallenge({ rankingInfo })
    },
  })
}

const calculInChallenge = async ({ rankingInfo }) => {
  const phases = sortedDatedObjects(rankingInfo.phases)
  const now = new Date()
  const currentPhase = phases?.find((phase) => phase.startDate < now && phase.endDate > now)

  if (!currentPhase) return
  console.log(`Challenge ${rankingInfo.challenge.name} en cours (phase : ${currentPhase.id})`)
  const challengeId = rankingInfo.challenge.id
  const challengeRef = db.collection("challenges").doc(challengeId)
  const rankingsRef = challengeRef.collection("rankings")
  // CREATE RANKINGS WHEN

  //* *************** GET RANKINGS ******************* */
  const rankings = await Ranking.fetchAll({ challengeId }, { refHook: (ref) => ref.where("phaseId", "==", currentPhase.id) })

  const results = []
  for (const ranking of rankings) {
    const rankingPromise = calculRanking({ challengeId, phase: currentPhase, rankingId: ranking.id, ranking, topPlayers: rankingInfo.topPlayers })
    results.push(rankingPromise)
  }
  await Promise.all(results)
}

const calculRanking = async ({ challengeId, phase, rankingId, ranking, topPlayers }) => {
  const rankingRef = db.collection("challenges").doc(challengeId).collection("rankings").doc(rankingId)

  const rankingFilter = phase.rankingFilters && phase.rankingFilters[0]
  let filters
  if (rankingFilter) {
    const rankingFilterValue = ranking[rankingFilter]?.id
    if (rankingFilterValue) {
      filters = []
      filters.push({
        key: rankingFilter,
        value: rankingFilterValue,
      })
    }
  }

  let teamsToUpdateSnap
  try {
    const fromDate = ranking.editedAt ? ranking.editedAt : phase.startDate
    // const fromDate = new Date(0) //TO HIDE
    teamsToUpdateSnap = await getTeamsToUpdateInRanking({ challengeId, filters, phaseId: ranking.phaseId, fromDate })
  } catch (err) {
    error("Error getting teamsSnap", err)
  }

  if (!teamsToUpdateSnap || !teamsToUpdateSnap.size) return false

  // UPDATE IN DB
  const newRankingTeams = await getNewRankingTeams({ teamsSnap: teamsToUpdateSnap, ranking, phase, topPlayers, challengeId })
  const newRanking = {
    teams: newRankingTeams,
    editedAt: timestamp.now(),
  }
  return rankingRef
    .update({ ...newRanking })
    .then(() => {
      // info(teamsToUpdateSnap.size + " teams updated in ranking : " + rankingId)
      // return {rankingId, teamUpdatedCount : teamsToUpdateSnap.size}
      return true
    })
    .catch((err) => {
      error(err)
      return false
    })
}

const getNewRankingTeams = async ({ teamsSnap, ranking, phase, topPlayers, challengeId }) => {
  const authorizedClubs = ranking.authorizedClubs
  let newRankingTeams = ranking.teams ? ranking.teams : []

  const batch = db.batch()
  teamsSnap.forEach((doc) => {
    const team = doc.data()
    const teamId = doc.id
    if (authorizedClubs && !authorizedClubs.includes(teamId)) return
    const teamPreview = getTeamRankingPreview({ teamId, team, phase, topPlayers })
    if (team.scoresUpdatedAt?.toDate() < team.lastActionAt?.toDate()) {
      const ref = Team.documentRef({ id: teamId, challengeId })
      batch.update(ref, { [`scores.${phase.id}`]: teamPreview.scores, scoresUpdatedAt: timestamp.now() })
    }
    const teamIndex = newRankingTeams.findIndex((item) => item.id === teamId)
    if (teamIndex === -1) {
      newRankingTeams.push(teamPreview)
    } else {
      newRankingTeams[teamIndex] = teamPreview
    }
  })

  await batch.commit()
  const maxLength = 900
  const teamCount = newRankingTeams.length > maxLength ? maxLength : newRankingTeams.length
  newRankingTeams = newRankingTeams
    .sort((a, b) => {
      const textA = a.name
      const textB = b.name
      return textA < textB ? -1 : textA > textB ? 1 : 0
    })
    .sort((a, b) => {
      const scoreA = a.scores?._stats?.score || 0
      const scoreB = b.scores?._stats?.score || 0
      return scoreA > scoreB ? -1 : scoreA > scoreB ? 1 : 0
    })
    .slice(0, teamCount)

  return newRankingTeams
}

const getTeamRankingPreview = ({ teamId, team, phase, topPlayers }) => {
  const teamLogo = team.logo ? team.logo["120"] || team.logo.original : null // mettre l'original au cas où la miniature n'existe pas
  const teamPreview = {
    id: teamId,
    name: team.name,
    colors: team.colors,
    logo: { 120: teamLogo },
    lastGameAt: team.playedAt,
    playerCount: team.playerCount || 0,
    refereeCount: team.refereeCount || 0,
    captainCount: team.captainCount || 0,
    scores: getTeamScoresForPhase({ players: team.players, phaseId: phase.id, topPlayers }),
  }

  if (phase.displayedFilter && team[phase.displayedFilter]) {
    teamPreview.displayedFilter = team[phase.displayedFilter].name
  }

  return teamPreview
}

const getTeamsToUpdateInRanking = async ({ challengeId, phaseId, filters, fromDate }) => {
  let teamsRef = db.collection("challenges").doc(challengeId).collection("teams")
  let teamsSnap
  try {
    const dateLimit = timestamp.fromDate(fromDate)

    teamsRef = teamsRef.where("lastActionAt", ">=", dateLimit)
    teamsRef = teamsRef.where("lastActionPhaseId", "==", phaseId)

    if (filters) {
      teamsRef = teamsRef.where(`${filters[0].key}.id`, "==", filters[0].value)
    }

    teamsSnap = await teamsRef.get()
  } catch (err) {
    error("Error getting documents", err)
  }

  return teamsSnap
}

module.exports = {
  calculRankingsInCurrentChallenges,
  calculInChallenge,
  getTeamScoresForPhase,
  getTeamRankingPreview,
}
