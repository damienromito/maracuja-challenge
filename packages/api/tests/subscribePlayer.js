const admin = require("firebase-admin")
const assert = require("chai").assert // https://devhints.io/chai

// const { PLAYER_ROLES } = require('../constants')
const { ANTI_CHEAT } = require("../constants")

const test = require("./helpers/configuration").getTester()
const maracujaFunctions = require("../index")
const { objectSubset } = require("../utils")

const { Club, Player, Team, User, Challenge, ChallengeSettings } = require("../models")

const _deviceId = "test123456789"
const _challengeId = "testffe"

const _player = {
  id: "E8F8FYFHUFH28dF",
  username: "toto",
  firstName: "Toto",
  password: "azerty",
  email: "toto@maracuja.ac",
  birthday: new Date(1989, 3, 9).toISOString(),
  deviceId: _deviceId,
  // "roles": [PLAYER_ROLES.CAPTAIN],
  // "fcmToken" : null,
  // "platform" : "web",
  // "avatar"
  // "currentPhaseId"
}

const _player2 = {
  id: "2E8F8FYFHUFH28dF",
  username: "titi",
  firstName: "Titi",
  password: "azerty",
  email: "titi@maracuja.ac",
  birthday: new Date(1989, 3, 9).toISOString(),
  deviceId: _deviceId,
}

const _team = {
  id: "testteam",
  name: "La team Test",
}

describe("Player Subscription", () => {
  let player
  let challengePlayerCount
  before(async () => {
    await Club.create({ id: _team.id }, { name: _team.name })
    await User.createUserWithEmailAndPassword(objectSubset(_player, ["email", "password", "username", "id"]))
    await User.createUserWithEmailAndPassword(objectSubset(_player2, ["email", "password", "username", "id"]))

    const stats = await ChallengeSettings.fetch({ challengeId: _challengeId, id: "stats" })

    challengePlayerCount = stats.playerCount
  })

  it("Player should subscribe", async () => {
    const context = { auth: { uid: _player.id } }
    const subscribePlayer = test.wrap(maracujaFunctions.apiPlayersSubscribeV2)
    await subscribePlayer(
      {
        challengeId: _challengeId,
        // mailjetListId,
        userId: _player.id,
        ...objectSubset(_player, ["birthday", "email", "firstName", "birthday", "deviceId"]),
        club: objectSubset(_team, ["id", "name"]),
      },
      context
    )
    player = await Player.fetch({ challengeId: _challengeId, id: _player.id })
    assert.equal(player.email, _player.email)
  })

  it("Player number should be 1", async () => {
    assert.equal(player.number, 1)
  })

  it("the team of the player should be also subscribed now", async () => {
    const new_team = await Team.fetch({ challengeId: _challengeId, id: _team.id })
    assert.isNotNull(new_team)
  })

  it("Challenge should be recorded in User data", async () => {
    const user = await User.fetch({ id: _player.id })
    assert.include(user.challengeIds, _challengeId)
  })

  it("Anti cheat : Doublon device Id should be detected", async () => {
    const context = { auth: { uid: _player2.id } }
    const subscribePlayer = test.wrap(maracujaFunctions.apiPlayersSubscribeV2)
    const result = await subscribePlayer(
      {
        challengeId: _challengeId,
        userId: _player2.id,
        ...objectSubset(_player2, ["birthday", "email", "firstName", "birthday", "deviceId"]),
        club: objectSubset(_team, ["id", "name"]),
      },
      context
    )

    console.log("result:", result)
    assert.equal(result.warning.code, ANTI_CHEAT.WARNING_CODE)

    const deviceIdIdenticalCount = await Player.fetchDeviceIdIdenticalCount({ deviceId: _deviceId, challengeId: _challengeId, currentPlayerId: _player2.id })
    console.log("deviceIdIdenticalCount:", deviceIdIdenticalCount)
    assert.equal(deviceIdIdenticalCount, 1)
  })

  after(async () => {
    await admin.auth().deleteUser(_player.id)
    await admin.auth().deleteUser(_player2.id)
    await Team.delete({ challengeId: _challengeId, id: _team.id })
    await Club.delete({ id: _team.id })
  })
})
