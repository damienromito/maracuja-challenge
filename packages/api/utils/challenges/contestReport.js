const { successResponse } = require("../../utils/response")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { Idea, Team, EventSubscription, Player, Challenge, QuestionSet, Notification, ChallengeSettings } = require("../../models")
const { PLAYER_ROLES, USER_ROLES, ACTIVITY_TYPES } = require("../../constants")
const { authOnCall } = require("../../utils/functions")
const fs = require("fs")
const { fetchChallengeEmailVariables } = require("../../utils/notifications/email")
const { sortedDatedObjects } = require("../../utils")
const admin = require("firebase-admin")
const fieldValue = admin.firestore.FieldValue
const timestamp = admin.firestore.Timestamp

const sendCaptainReport = async ({ challenge }) => {
  if (!challenge.questionSets || !Object.keys(challenge.questionSets).length) return

  const questionSets = challenge.sortedQuestionSets({
    maxDate: new Date(),
    byEndDate: true,
    hook: (qs) => {
      if (qs.type === ACTIVITY_TYPES.CONTEST) return qs
      return null
    },
  })

  const lastQuestionSet = questionSets[questionSets.length - 1]
  if (!lastQuestionSet) return

  const settings = await ChallengeSettings.fetch({ challengeId: challenge.id, id: "general" })
  if (settings.captainReport?.questionSetsReported?.includes(lastQuestionSet.id)) return
  await sendReport({ challengeId: challenge.id, contestId: lastQuestionSet.id, phaseId: lastQuestionSet.phase.id })
  await settings.update({
    ["captainReport.questionSetsReported"]: fieldValue.arrayUnion(lastQuestionSet.id),
    ["captainReport.lastReportSendAt"]: timestamp.now(),
  })
}

const sendReport = async ({ challengeId, contestId, phaseId }) => {
  debug("Send Report for " + contestId + " in " + challengeId)
  // LOAD DATA
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const challenge = await Challenge.fetch({ id: challengeId })

  // const team = await Team.fetch({ challengeId, id: 'maracujateam_33100_autre' })
  // const teams = [team]

  const teams = await Team.fetchAll({ challengeId })

  const promises = []

  teams.forEach((team) => {
    if (!team.players) return

    const params = {
      challengeId,
      phaseId,
      contestId,
      team,
      challenge,
    }
    const teamEmailsPromise = builtTeamReportEmails(params)
    promises.push(teamEmailsPromise)
  })

  const responses = await Promise.all(promises)
  const usersObjects = responses.reduce((result, teamEmailsObjects) => result.concat(teamEmailsObjects), [])
  // console.dir(usersObjects, { depth: null })

  const campaignId = `${challenge.code} Récap' du jour ${contestId}`
  const htmlContent = fs.readFileSync("./data/emails/contestReport.html", "utf-8")
  const userPropertiesKeys = ["username", "title", "teamName", "teamLogoUrl", "constestScore", "contestName", "playerEngagment", "constestCount", "playerCount", "bestPlayersNames", "bestPlayersScore", "teamPrimaryColor"]

  const variables = await fetchChallengeEmailVariables(challengeId)
  await Notification.sendEmail({
    users: usersObjects,
    htmlContent,
    userPropertiesKeys,
    campaignId,
    variables,
  })

  await QuestionSet.update({ challengeId, id: contestId }, { emailReportSent: true })
}

const builtTeamReportEmails = async ({ team, ideas, eventsSubscriptions, challengeId, contestId, phaseId, challenge }) => {
  let teamEmailVariables = {
    ...buildTeamReportVariables({ team, ideas, eventsSubscriptions }),
  }
  if (ideas) {
    // teamEmailVariables = {...teamEmailVariables, }
  }
  if (contestId) {
    teamEmailVariables = {
      ...teamEmailVariables,
      ...buildTeamReportContest({ team, contestId, challenge, phaseId }),
    }
  }

  const promises = []
  Object.keys(team.players).forEach((playerKey) => {
    const player = team.players[playerKey]
    if (player.roles.includes(PLAYER_ROLES.CAPTAIN)) {
      promises.push(Player.fetch({ challengeId, id: playerKey }))
    }
  })
  const captains = await Promise.all(promises)
  const userObjects = []

  captains.forEach((captain) => {
    const data = {
      email: captain.email,
      username: captain.username,
      ...teamEmailVariables,
      title: `${challenge.name} : Le récap' du jour de ton équipe ${team.name}`,
    }
    if (!data.teamLogoUrl) {
      data.teamLogoUrl = "https://firebasestorage.googleapis.com/v0/b/maracuja-english-challenge.appspot.com/o/placeholder%2Fplaceholder-club-avatar.png?alt=media&token=dd40749e-7cf6-45df-89c6-6c2050a6bf8a"
    }
    if (!data.teamPrimaryColor) {
      data.teamPrimaryColor = challenge.colors.primary
    }
    userObjects.push(data)
  })
  return userObjects
}

const buildTeamReportContest = ({ team, contestId, challenge, phaseId }) => {
  const playerCount = team.playerCount
  const contest = challenge.questionSets[contestId]
  const stats = team.scores?.[phaseId]?.contests?.[contestId]?._stats
  const constestCount = stats?.count || 0
  const constestScore = stats?.score || 0
  const playerEngagment = Math.round((constestCount / playerCount) * 100)

  let bestPlayersNames = []
  let bestPlayersScore = 0
  Object.keys(team.players).forEach((key) => {
    const player = team.players[key]
    const playerScore = player.scores?.[phaseId]?.contests?.[contestId]?._stats?.score

    if (playerScore) {
      if (playerScore > bestPlayersScore) {
        bestPlayersNames = [player.username]
        bestPlayersScore = playerScore
      } else if (playerScore === bestPlayersScore) {
        bestPlayersNames.push(player.username)
      }
    }
  })

  return {
    contestName: contest.name,
    constestScore,
    constestCount,
    bestPlayersNames: bestPlayersNames?.length ? bestPlayersNames.join(", ") : "Aucun joueur",
    bestPlayersScore: bestPlayersScore || 0,
    playerEngagment,
  }
}

const buildTeamReportVariables = ({ team, ideas, eventsSubscriptions }) => {
  const playerCount = team.playerCount

  const membersKeys = team.members ? Object.keys(team.members) : []
  const memberCount = (membersKeys?.length || 0) + playerCount
  const membersEngagment = Math.round((playerCount / memberCount) * 100)
  const missingPlayerCount = memberCount - playerCount
  const missingPlayers = memberCount
    ? membersKeys
        .map((key) => {
          const member = team.members[key]
          return member.firstName || "" + " " + member.lastName || ""
        })
        .join(", ")
    : "Equipe au complet"
  // 80% des joueurs sont inscrits (56 inscrits sur 71)

  const emailVariables = {
    teamName: team.name,
    teamPrimaryColor: team.colors?.primary,
    teamLogoUrl: team.logo?.getUrl(200),
    memberCount,
    missingPlayerCount,
    membersEngagment,
    missingPlayers,
    playerCount,
  }

  return emailVariables
}

module.exports = {
  sendReport,
  sendCaptainReport,
}
