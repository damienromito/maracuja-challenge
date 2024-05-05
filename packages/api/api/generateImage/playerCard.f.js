// doawload all storage folder with  f=gs://maracuja-english-challenge.appspot.com/cards/aquitel_welcome0306 yarn dl-folder
const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const db = admin.firestore()
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const { successResponse } = require("../../utils/response")
const fs = require("fs")
const os = require("os")
const path = require("path")
const util = require("util")
const captureWebsite = require("capture-website")
const { Player, Team, Challenge } = require("../../models")
const { uploadToStorage } = require("../../utils/storage")
const { objectSubset } = require("../../utils")
const { USER_ROLES } = require("../../constants")
const { authOnCall } = require("../../utils/functions")

const runtime = {
  timeoutSeconds: 540,
  memory: "2GB",
}

exports = module.exports = authOnCall({ role: USER_ROLES.SUPER_ADMIN, runtime }, async (data, context) => {
  const { playerId, challengeId, teamId } = data

  // Get player data from db
  const team = await Team.fetch({ challengeId, id: teamId })
  const challenge = await Challenge.fetch({ id: challengeId })
  const players = Object.keys(team.players).map((key) => team.players[key])
  const cardsUrls = []

  const generateTeamPlayerCards = async (index = 0) => {
    const player = players[index]
    const imgUrl = await generatePlayerCard({ team, player, challenge })
    cardsUrls.push(imgUrl)
    if (index < players.length - 1) {
      await generateTeamPlayerCards(index + 1)
    }
  }

  if (playerId) {
    const player = team.players[playerId]
    const imgUrl = await generatePlayerCard({ team, player, challenge })
    cardsUrls.push(imgUrl)
  } else {
    await generateTeamPlayerCards()
  }

  return successResponse({ cardsUrls })
})

const generatePlayerCard = async ({ team, player, challenge }) => {
  const filteType = "png"
  // const filteType = 'jpg'

  const teamData = objectSubset(team, ["name", "logo", "colors"])
  teamData.logo = objectSubset(team.logo, ["original", "400"])
  const appData = {
    team: teamData,
    player: objectSubset(player, ["username", "number", "avatar", "roles"]),
    challenge: objectSubset(challenge, ["image", "playersAvatarWithoutBackground"]),
  }
  // Create fie
  const dataPath = "data/AvatarGenerator/build/data.js"
  const newJsonFile = "window.generatedData =" + util.inspect(appData)
  fs.writeFile(dataPath, newJsonFile, (err) => {
    if (err) return console.error(err)
  })

  // Screen with capture website from build of microservice

  const tempFilePath = path.join(os.tmpdir(), `${player.id}.${filteType}`)
  // await fs.unlinkSync(tempFilePath)

  const generatorPath = "data/avatarGenerator/build/index.html"
  try {
    await captureWebsite.file(generatorPath, tempFilePath, {
      // inputType: 'html',
      height: 500,
      width: 400,
      scaleFactor: 2,
      type: "png",
      waitForElement: ".card-to-print",
    })
  } catch (error) {
    await fs.unlinkSync(tempFilePath)
  }

  const fileName = `${player.id}.${filteType}`
  const filePath = `cards/${challenge.id}/${team.id}/${fileName}`

  // Upload files (and delete temp file to upload storage
  let file
  try {
    file = await uploadToStorage({
      tempFilePath,
      contentType: `image/${filteType}`,
      filePath,
      fileName,
    })
  } catch (error) {
    await fs.unlinkSync(tempFilePath)
  }
  const cardUrl = file.metadata.mediaLink
  await Player.update({ id: player.id, challengeId: challenge.id }, { cardUrl })
  return cardUrl
}
