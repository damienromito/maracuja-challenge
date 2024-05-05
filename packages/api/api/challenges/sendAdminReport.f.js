const { successResponse } = require("../../utils/response")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { Idea, Team, EventSubscription, Player, Challenge, QuestionSet, Notification, WhitelistMember } = require("../../models")
const { PLAYER_ROLES, USER_ROLES, MARACUJA_CLUB_ID } = require("../../constants")
const { authOnCall } = require("../../utils/functions")
const { sendReport } = require("../../utils/challenges/contestReport")
const fs = require("fs")
const { fetchChallengeEmailVariables } = require("../../utils/notifications/email")
const { calculateEngagementInChallenge } = require("../../utils/challenges")
const dayjs = require("dayjs")
require("dayjs/locale/fr")
dayjs.locale("fr")
var relativeTime = require("dayjs/plugin/relativeTime")
const ChallengeSettings = require("../../models/ChallengeSettings")
const { emailBuilder } = require("../../utils/emails/builder")
dayjs.extend(relativeTime)
const admin = require("firebase-admin")

const timestamp = admin.firestore.Timestamp
exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN }, async (data, context) => {
  const { challengeId, testEmail } = data

  //Recolter variable
  const variables = await fetchChallengeEmailVariables(challengeId)
  const challenge = variables.challenge
  const settings = await ChallengeSettings.fetch({ challengeId, id: "general" })
  const stats = await ChallengeSettings.fetch({ challengeId, id: "stats" })
  variables.introMessage = getIntroMessage({ challenge })

  delete variables.challenge

  const title = `[${challenge.code}] Suivi du ${challenge.name}`

  const layoutList = ["header"]

  await addToEmailIntroLayout({ challenge, layoutList, variables })
  await addToEmailKeyNumbersLayout({ challenge, layoutList, variables, stats })
  if (challenge.ideasBoxesEnabled) {
    await addToEmailIdeas({ challenge, layoutList, variables, settings, stats })
  }

  layoutList.push("dashboardLink")
  layoutList.push("help")
  layoutList.push("footer")
  const htmlContent = emailBuilder({ folder: "adminReport", layoutList, forAdmin: true })

  const campaignId = `${challenge.code} Suivi du ${challenge.name}`
  variables.dashboardLink = `https://dashboard.maracuja.ac/challenges/${challenge.id}`

  //Destinataires
  const userPropertiesKeys = ["firstName"]
  let usersObjects = []
  if (testEmail) {
    usersObjects.push({
      email: testEmail,
      firstName: "Testeur",
    })
  } else {
    usersObjects = settings?.staff
    usersObjects.push(...getAdminsUsers())
  }

  await Notification.sendEmail({
    users: usersObjects,
    challengeId,
    htmlContent,
    title,
    campaignId,
    variables,
    userPropertiesKeys,
    fromEmail: "test@maracuja.ac",
  })

  if (!testEmail) {
    await ChallengeSettings.update({ challengeId, id: "general" }, { "adminReport.lastSendAt": timestamp.now() })
  }
  return successResponse(true)
})

const getIntroMessage = ({ challenge }) => {
  let introMessage = `Voici un récapitulatif du challenge "${challenge.name}"`
  if (challenge.scenarioType === "trainingAction") {
    if (challenge.trainingActions.dates.length > 1) {
      introMessage += ` lié aux journées ${challenge.trainingActions.label} du ${dayjs(challenge.trainingActions.dates[0].toDate()).format("D MMMM")} et ${dayjs(challenge.trainingActions.dates[1].toDate()).format("D MMMM YYYY")}.`
    } else {
      introMessage += ` lié à la journée ${challenge.trainingActions.label} du ${dayjs(challenge.trainingActions.dates[0].toDate()).format("dddd D MMMM YYYY")}.`
    }
  } else {
    introMessage += ". "
  }
  return introMessage
}

const buildPercent = (numerator, denominator) => {
  const decimal = numerator / denominator
  return Math.round((decimal || 0) * 100)
}

const getAdminsUsers = () => {
  return [
    {
      email: "damien@maracuja.ac",
      firstName: "Damien",
    },
    {
      email: "antony@maracuja.ac",
      firstName: "Antony",
    },
    {
      email: "vincent@maracuja.ac",
      firstName: "Vincent",
    },
  ]
}

const addToEmailIdeas = async ({ challenge, layoutList, variables, settings, stats }) => {
  const lastSendAt = settings?.adminReport?.lastSendAt || challenge.startDate
  const ideas = await Idea.fetchAll({ challengeId: challenge.id }, { refHook: (ref) => ref.where("createdAt", ">", lastSendAt) })

  variables.ideasCount = stats.ideaCount
  variables.newIdeasCount = ideas.length || 0

  let ideasList = ""
  if (ideas) {
    ideas.map((idea) => {
      ideasList += `<p class="text-build-content" data-testid="EVNiEctmo" style="margin: 10px 0;"><span style="font-family:Arial;font-size:14px;"><i>💬 </i>${idea.player.username} (${idea.team.name})</span></p>
    <p class="text-build-content" data-testid="EVNiEctmo" style="margin: 10px 0; margin-bottom: 10px;"><span style="font-family:Arial;font-size:14px;"><i>${idea.idea}</i></span></p>`
    })
  }
  variables.ideasList = ideasList
  variables.dashboardIdeasLink = `https://dashboard.maracuja.ac/challenges/${challenge.id}/ideas-boxes`
  layoutList.push("ideas")
}

const addToEmailIntroLayout = async ({ challenge, layoutList, variables }) => {
  variables.remainingMessage = `Le challenge se termine ${dayjs().to(challenge.endDate.toDate())}.`
  layoutList.push("intro")
}

const addToEmailKeyNumbersLayout = async ({ challenge, layoutList, variables, stats }) => {
  const playersEngagement = await calculateEngagementInChallenge({ challenge })

  const playerCount = stats.playerCount || 0

  let participantsCount

  if (challenge.audience.whitelist === "whitelist") {
    layoutList.push("keyNumbersWhitelist")
    const partitipants = await await WhitelistMember.fetchAll({ challengeId: challenge.id })
    participantsCount = partitipants.reduce((prev, current) => {
      return !current.clubId || current.clubId != MARACUJA_CLUB_ID ? prev + 1 : prev
    }, 0)
    variables.participantsPercent = buildPercent(playerCount, participantsCount)
  } else {
    layoutList.push("keyNumbers")
  }

  variables.playerCount = playerCount
  variables.participantsCount = participantsCount
  variables.avatarCount = stats.avatars?.uniqueCount || 0
  variables.avatarPercent = buildPercent(variables.avatarCount, playerCount)
  variables.icebreakerCount = stats.icebreaker?.questionCount || 0
  variables.icebreakerPercent = buildPercent(variables.icebreakerCount, playerCount)
  variables.playersEngagementPercent = Math.round((playersEngagement || 0) * 100)
}
