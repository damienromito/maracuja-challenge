const { Notification, Player, Team, ChallengeSettings } = require("../../models")
const fs = require("fs")
const { fetchChallengeEmailVariables } = require("../notifications/email")
const { PLAYER_ROLES, MARACUJA_CLUB_ID } = require("../../constants")
const admin = require("firebase-admin")

const fieldValue = admin.firestore.FieldValue

const removeCaptainToTeam = async ({ playerId, challengeId, teamId }) => {
  console.log(" playerId, challengeId, teamId:", playerId, challengeId, teamId)
  await Player.update(
    { challengeId, id: playerId },
    {
      roles: fieldValue.arrayRemove(PLAYER_ROLES.CAPTAIN),
    }
  )
  await ChallengeSettings.updateStats(
    { challengeId, teamId },
    {
      captainCount: fieldValue.increment(-1),
    }
  )

  await Team.update(
    { challengeId, id: teamId },
    {
      captainCount: fieldValue.increment(-1),
    }
  )
}

const addCaptainToTeam = async ({ playerId, challengeId, teamId }) => {
  // GET PLAYER
  await Player.update(
    { challengeId, id: playerId },
    {
      roles: fieldValue.arrayUnion(PLAYER_ROLES.CAPTAIN),
      optinCaptain: true,
    }
  )
  await ChallengeSettings.updateStats(
    { challengeId, teamId },
    {
      captainCount: fieldValue.increment(1),
    }
  )

  await Team.update(
    { challengeId, id: teamId },
    {
      captainCount: fieldValue.increment(1),
    }
  )

  await sendEmailToCaptain({ challengeId, playerId })
}

const sendEmailToCaptain = async ({ challengeId, playerId }) => {
  console.log("send for challenge challengeId:", challengeId, playerId)
  const variables = await fetchChallengeEmailVariables(challengeId)
  console.log("variables:", variables)

  const title = `${variables.challengeName} : Tes missions de capitaine ! `
  console.log("title:", title)
  const captain = await Player.fetch({ challengeId, id: playerId })
  const htmlContent = fs.readFileSync("./data/emails/captainBriefing.html", "utf-8")
  const userPropertiesKeys = ["firstName"]
  await Notification.sendEmail({
    users: [captain],
    challengeId,
    templateId: "",
    htmlContent,
    userPropertiesKeys,
    title,
    variables,
  })
}

module.exports = {
  sendEmailToCaptain,
  addCaptainToTeam,
  removeCaptainToTeam,
}
