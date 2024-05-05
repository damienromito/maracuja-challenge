const admin = require("firebase-admin")
const { objectSubset } = require("../../utils")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { Team, Player, Challenge } = require("../../models")
const { PLAYER_ROLES } = require("../../constants")
const { ANTI_CHEAT } = require("../../constants")
const { successResponse } = require("../../utils/response")
const { authOnCall } = require("../../utils/functions")
const WhitelistMember = require("../../models/WhitelistMember")
const db = admin.firestore()
const fieldValue = admin.firestore.FieldValue
const timestamp = admin.firestore.Timestamp

exports = module.exports = authOnCall({ auth: false }, async (data, context) => {
  const {
    userId,
    challengeId,
    club,
    deviceId,
    currentPhaseId,

    // mailjetListId
  } = data
  debug("data:", data)

  const challenge = await Challenge.fetch({ id: challengeId })

  if (!context?.auth?.uid) {
    info("User inscrit sans auth", data)
  }
  // CHECK IDENTICAL DEVICE
  // const deviceIdIdenticalCount = await Player.fetchDeviceIdIdenticalCount({ deviceId, challengeId, currentPlayerId: userId })

  // if (deviceIdIdenticalCount === ANTI_CHEAT.LIMIT) {
  //   const warning = {
  //     title: "Avertissement",
  //     message: ANTI_CHEAT.WARNING_TITLE + " " + ANTI_CHEAT.WARNING_MESSAGE,
  //     code: "anti-cheat/forbidden",
  //   }
  //   return successResponse({ warning })
  // }
  // info(`Inscription  de ${userId} dans ${club.id} (${context?.auth?.uid})`)

  // CREATE TEAM
  const newClub = { editedAt: timestamp.now() }
  let team = await Team.fetch({ challengeId, id: club.id })
  if (!team) {
    debug("club:", club, challengeId)
    if (!club.id) {
      throw Error("Club Id is not defined")
    }
    team = await createTeam({ challengeId, clubId: club.id, currentPhaseId })
    newClub.challengeIds = fieldValue.arrayUnion(challengeId)
  }

  const newPlayer = {
    ...objectSubset(data, ["acceptNotification", "appVersion", "avatar", "birthday", "challengeId", "deviceId", "email", "fcmToken", "firstName", "lastName", "licenseNumber", "optinRole", "phoneNumber", "platform", "publicIp", "questionSetEngagment", "referer", "roles", "updatedLicenseInfo", "username", "createdAtInWhitelist"]),
    club: objectSubset(team, ["id", "name"]),
    clubId: team.id,
    createdAt: timestamp.now(),
    editedAt: timestamp.now(),
    number: team.lastPlayerNumber ? team.lastPlayerNumber + 1 : 1,
    acceptNotification: true,
  }

  // deviceIdIdenticalCount && (newPlayer.deviceIdIdenticalCount = deviceIdIdenticalCount)

  newPlayer.birthday && (newPlayer.birthday = new Date(newPlayer.birthday))
  newPlayer.createdAtInWhitelist && (newPlayer.createdAtInWhitelist = new Date(newPlayer.createdAtInWhitelist))

  // REFEREE
  if (newPlayer.roles?.includes(PLAYER_ROLES.REFEREE)) {
    await Player.update(
      { id: newPlayer.referer.id, challengeId },
      {
        refereeCount: fieldValue.increment(1),
        [`referees.${userId}`]: objectSubset(newPlayer, ["id", "username"]),
      }
    )
  }

  // MAILJET
  // if (mailjetListId) {
  //   try {
  //     const mailjetContactId = await Player.subscribeToChallengeTips({ mailjetListId, player: newPlayer, challengeId, transactionalOnly: true }, true)
  //     newPlayer.mailjetContactId = mailjetContactId
  //   } catch (err) {
  //     error('Error : MailjetList Id not ok', err, player)
  //   }
  // }

  // WHITELIST
  if (challenge.audience.whitelist === "whitelist" && !newPlayer.roles.includes(PLAYER_ROLES.REFEREE)) {
    await WhitelistMember.update(
      { challengeId, id: userId },
      {
        subscribed: true,
        subscribedAt: timestamp.now(),
        team: objectSubset(team, ["id", "name"]),
        clubId: team.id,
      }
    )
  }

  const batch = db.batch()

  const playerRef = db.collection("challenges").doc(challengeId).collection("players").doc(userId)
  batch.set(playerRef, newPlayer)

  const userRef = db.collection("users").doc(userId)
  const newUser = await getNewUser({ userId, player: newPlayer })
  batch.set(userRef, newUser, { merge: true })

  const teamRef = db.collection("challenges").doc(challengeId).collection("teams").doc(team.id)
  const newTeam = getNewTeam({ clubId: team.id, userId, player: newPlayer, currentPhaseId, members: team.members })
  batch.update(teamRef, newTeam)

  const clubRef = db.collection("clubs").doc(team.id)
  newClub[`members.${userId}`] = objectSubset(newPlayer, ["username", "lastName", "firstName"])
  batch.update(clubRef, newClub)

  await batch.commit()

  let warning
  // if (deviceIdIdenticalCount === 1) {
  //   warning = {
  //     title: ANTI_CHEAT.WARNING_TITLE,
  //     message: ANTI_CHEAT.WARNING_MESSAGE,
  //     code: "anti-cheat/advertisement",
  //   }
  // }

  return successResponse({ warning })
})

const getNewTeam = ({ clubId, userId, player, currentPhaseId, members }) => {
  debug("team updated for inscription :", clubId)

  const newTeam = {
    editedAt: timestamp.now(),
    playerCount: fieldValue.increment(1),
    lastActionAt: timestamp.now(), // WILL UPDATE RANKING
    lastPlayerNumber: player.number,
  }

  if (currentPhaseId) {
    newTeam.lastActionPhaseId = currentPhaseId
  }

  if (members?.[userId]) {
    info(`User ${userId} will be delete from team members ${clubId} `)
    newTeam[`members.${userId}`] = fieldValue.delete()
  }
  // else{
  //   info(`User ${userId} not exist in members ${clubId} `)
  // }

  // referal
  if (player.roles?.includes(PLAYER_ROLES.REFEREE)) {
    newTeam.refereeCount = fieldValue.increment(1)
    newTeam[`players.${player.referer.id}.refereeCount`] = fieldValue.increment(1) // to delete
    // CAPTAIN
  } else if (player.roles?.includes(PLAYER_ROLES.CAPTAIN)) {
    newTeam.captainCount = fieldValue.increment(1)
  }

  const newTeamPlayer = {
    id: userId,
    ...objectSubset(player, ["firstName", "username", "number", "avatar", "acceptNotification", "referer", "roles"]),
    // roles: player.roles || [],
    // referer: player.roles.includes(ROLES.REFEREE) ? player.referer : null,
    createdAt: timestamp.now(),
  }
  if (player.referer) {
    newTeamPlayer.referer = objectSubset(player.referer, ["id", "username"])
  }
  newTeam[`players.${userId}`] = newTeamPlayer

  return newTeam
}

const createTeam = async ({ challengeId, clubId, currentPhaseId }) => {
  debug("CLUB " + clubId + " WILL BE CREATED IN CHALLENGE " + challengeId)
  const teamRef = db.collection("challenges").doc(challengeId).collection("teams").doc(clubId)

  let club
  try {
    const clubSnap = await db.collection("clubs").doc(clubId).get()
    if (!clubSnap.exists) {
      error("Parent club for new team don't exists", clubId)
    } else {
      club = clubSnap.data()
    }
  } catch (err) {
    error("Error getting club", err)
  }

  const newTeam = {
    ...objectSubset(club, ["name", "zipCode", "logo", "city", "region", "tribe", "department", "ffeClubNumber", "schoolType", "schoolAcademy", "ffeClubNumber", "sportFederation", "lastPlayerNumber", "lrrBassin"]),
    club: objectSubset(club, ["id", "name"]),
    challengeId,
    challenge: { id: challengeId },
    createdAt: timestamp.now(),
    lastActionAt: timestamp.now(),
  }

  if (currentPhaseId) {
    newTeam.lastActionPhaseId = currentPhaseId
  }

  await teamRef.set(newTeam)
  newTeam.id = clubId
  return newTeam
}

const getNewUser = async ({ userId, player }) => {
  const challengeId = player.challengeId

  if (player.username) {
    admin.auth().updateUser(userId, {
      displayName: player.username,
    })
  }

  // TODO IF ALREADY EXIST

  const data = {
    ...objectSubset(player, [
      "phoneNumber",
      "email",
      "birthday",
      "fcmToken",
      "acceptNotification",
      // 'mailjetContactId',
      "platform",
      "firstName",
      "lastName",
      "username",
      "number",
      "editedAt",
      "licenseNumber",
    ]),
    challengeIds: fieldValue.arrayUnion(challengeId),
    clubId: player.club.id,
    challengeId: challengeId,
  }

  return data
}
