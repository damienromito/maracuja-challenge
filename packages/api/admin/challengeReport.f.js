/** *******WARNING*************/
// NE PAS EXPOSER EN PRODUCTION//
/** *******WARNING*************/

const { fetchDataToExport } = require("../utils/dbExport")
const { Challenge } = require("../models")
const { ACTIVITY_TYPES, USER_ROLES } = require("../constants")
const Ranking = require("../models/Ranking")
const exportPlayers = require("./challengeReport/exportPlayers")
const exportNotifications = require("./challengeReport/exportNotifications")
const exportAnswers = require("./challengeReport/exportAnswers")
const exportGames = require("./challengeReport/exportGames")
const exportTeams = require("./challengeReport/exportTeams")
const exportRankings = require("./challengeReport/exportRankings")
const { authOnCall } = require("../utils/functions")

const runtime = {
  timeoutSeconds: 540,
  memory: "2GB",
}

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN, runtime }, async (data, context) => {
  const { challengeId, pages, questionSetId, calc } = data
  const challenge = await Challenge.fetch({ id: challengeId })
  const questionSets = challenge.sortedQuestionSets()
  const phases = challenge.sortedPhases()

  const questionSetScoresPath = buildQuestionSetScoresPath({ questionSets })

  let rankings

  const result = {}
  if (pages.teams) {
    result.teamsUrl = await exportTeams({
      challengeId,
      questionSetScoresPath,
    })
  }

  const haveToCalcEngagment = calc.engagmentRate
  if (pages.players || pages.rankings) {
    if (haveToCalcEngagment || pages.rankings) {
      rankings = await Ranking.fetchAll({ challengeId })
    }
  }
  if (pages.rankings) {
    result.rankingsUrl = await exportRankings({ rankings, challengeId })
  }
  if (pages.players) {
    result.playersUrl = await exportPlayers({
      challengeId,
      questionSetScoresPath,
      haveToCalcEngagment,
      questionSets,
      rankings,
      phases,
    })
  }
  if (pages.games || pages.answers) {
    const gamesObjects = await fetchDataToExport({
      challengeId,
      collection: "games",
      where: questionSetId ? [{ key: "questionSet.id", value: questionSetId }] : null,
    })

    if (pages.games) {
      result.gamesUrl = await exportGames({ challengeId, gamesObjects })
    }
    if (pages.answers) {
      result.answsersUrl = await exportAnswers({ gamesObjects, challengeId })
    }
  }

  if (pages.notifications) {
    result.notificationsUrl = await exportNotifications({ challengeId })
  }

  return result
})

const buildQuestionSetScoresPath = ({ questionSets }) => {
  const questionSetScoresPath = []
  questionSets.forEach((qs) => {
    // Generate the path  "scores.4xchallenge_z.trainings.icrebreaker_maracujateam_33100_autre._stats.progression"
    if (qs.audienceRestricted) {
      // exclude
      return
    }

    const getActivityStatsPath = (activitiesString, statKey) => {
      return `scores.${qs.phase.id}.${activitiesString}.${qs.id}._stats.${statKey}`
    }

    if (qs.type === ACTIVITY_TYPES.CONTEST) {
      questionSetScoresPath.push(getActivityStatsPath("contests", "score"))
      questionSetScoresPath.push(getActivityStatsPath("debriefings", "progression"))
    } else if (qs.type === ACTIVITY_TYPES.TRAINING) {
      questionSetScoresPath.push(getActivityStatsPath("trainings", "progression"))
    }
  })

  return questionSetScoresPath
}
