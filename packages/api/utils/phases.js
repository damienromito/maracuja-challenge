const { sortedDatedObjects } = require(".")
const { Team, Challenge } = require("../models")
const { getChallenge } = require("./challenges")
const { getTeamRankingPreview } = require("./rankings")
const { createPhaseRankings } = require("./rankings/create")

const updatePhaseRankings = async ({ challengeId, phaseId }) => {
  const challenge = await Challenge.fetch({ id: challengeId })

  const phases = sortedDatedObjects(challenge.phases)
  const phase = phases.find((p) => p.id === phaseId)
  const phaseIndex = phases.map((p) => p.id).indexOf(phaseId)

  let previousPhase
  if (phaseIndex > 0) {
    previousPhase = phases[phaseIndex - 1]
  }

  const params = { challengeId, phase, previousPhase }
  if (challenge.audience?.filters) {
    params.audienceFilters = challenge.audience.filters
  }

  const topPlayers = challenge.topPlayersEnabled ? challenge.topPlayers : null
  const teamsToDisplay = await displayTeamInRanking({ challengeId, phase, topPlayers })
  if (teamsToDisplay) {
    params.teamsToDisplay = teamsToDisplay
  }
  await createPhaseRankings(params)
}

const displayTeamInRanking = async ({ challengeId, phase, topPlayers }) => {
  const data = {
    lastActionAt: phase.startDate,
    lastActionPhaseId: phase.id,
  }
  await Team.updateAll({ challengeId }, data)
  const teams = await Team.fetchAll({ challengeId })
  return teams.map((team) => {
    return getTeamRankingPreview({ team, teamId: team.id, phase, topPlayers })
  })
}

module.exports = { updatePhaseRankings }
