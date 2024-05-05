const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const sharp = require("sharp")
const { errorResponse, successResponse } = require("../../utils/response")
const ROLES = require("../../constants/roles")
const spawn = require("child-process-promise").spawn
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const qs = require("querystring")
const http = require("https")
const os = require("os")
const fs = require("fs")
const https = require("https")
const FormData = require("form-data")

const path = require("path")
const hotpotApiKey = HOTPOT_API_KEY
const db = admin.firestore()
const FieldValue = admin.firestore.FieldValue

const { uploadToStorage, fetchImageWithoutBackground } = require("../../utils/storage")
const { authOnCall } = require("../../utils/functions")
const { MARACUJA_CLUB_ID } = require("../../constants")
const { ChallengeSettings } = require("../../models")

const runtime = {
  timeoutSeconds: 540,
  memory: "512MB",
}

exports = module.exports = authOnCall({ auth: true, runtime }, async (data, context) => {
  const { challengeId, playerId, imageUrl, oldAvatarReplaced, test, removeBackground, teamId } = data

  const challengeRef = db.collection("challenges").doc(challengeId)
  const playerRef = challengeRef.collection("players").doc(playerId)

  const avatar = { original: imageUrl }

  if (removeBackground) {
    if (!test) {
      avatar.original = await transformAndUploadAvatarUrlWithoutBackground({ url: imageUrl, playerId, challengeId, imageName: "avatar" })
    }
    avatar.backgroundRemoved = true
  }

  await playerRef.update({
    avatar,
    avatarUploadCount: FieldValue.increment(1),
  })

  const stats = {}
  stats["avatars.count"] = FieldValue.increment(1)
  if (!oldAvatarReplaced) {
    stats["avatars.uniqueCount"] = FieldValue.increment(1)
  }
  await ChallengeSettings.updateStats({ challengeId, teamId }, stats)

  return successResponse()
})

// const transformAvatarUrlWithoutBackground = async (url,playerId, challengeId) => {
//  const imageUrl = await backgroundRemovalUrlToUrl(url)
//  console.log('imageUrl:', imageUrl)
//  return imageUrl
// }

const transformAndUploadAvatarUrlWithoutBackground = async ({ url, playerId, challengeId, imageName }) => {
  const tempFilePath = await backgroundRemovalUrlToTempFile(url, playerId)

  // const tempFilePath = await backgroundRemovalUrlToTempFile(url, playerId)
  // const tempFilePath = "/var/folders/zc/r2q4mnvj1tz8db8mzd7m3x_80000gn/T/tempWithoutBackgroundImage-DJoziuvK74gOTv4KTfGHJkODeXy2.png"

  const fileName = `${imageName}.png`
  const filePath = `users/${playerId}/${fileName}`

  const file = await uploadToStorage({
    tempFilePath: tempFilePath,
    contentType: "image/png",
    filePath: filePath,
    fileName: fileName,
    customMetadata: {
      transformed: "background-removed",
      fromChallengeId: challengeId,
      transformationEnabled: "false",
    },
  })

  debug("file:", file.metadata.mediaLink)
  return file.metadata.mediaLink
}

const backgroundRemovalUrlToTempFile = async (url, playerId) => {
  const bucket = admin.storage().bucket()
  const imageNameMatched = url.match(/.*(avatar.*)\?.*/i)
  const imageName = imageNameMatched[1]

  // avatar.jpg
  const file = bucket.file(`users/${playerId}/${imageName}`)
  const tempFileName = playerId + "_" + path.basename(file.name)
  const tempFilePath = path.join(os.tmpdir(), tempFileName)
  await file.download({ destination: tempFilePath })

  const resizedImageBuffer = await sharp(tempFilePath)
    .rotate()
    .resize(1200, 1200, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .toBuffer()

  const tempFileResizedName = playerId + "_resized_" + path.basename(file.name)

  const tempFileResizedPath = path.join(os.tmpdir(), tempFileResizedName)

  await sharp(resizedImageBuffer).toFile(tempFileResizedPath)
  await fs.unlinkSync(tempFilePath)

  // const temp = await backgroundRemovalWithObjectCut({img64 :img64, docId : playerId })
  const tempFileUrl = await backgroundRemovalWithHotPot({ imagePath: tempFileResizedPath, docId: playerId })
  await fs.unlinkSync(tempFileResizedPath)

  return tempFileUrl
}

// const backgroundRemovalWithObjectCut = ({img64, url, docId}) => {

//   //https://rapidapi.com/objectcut.api/api/background-removal/endpoints

//   return new Promise((resolve, reject) => {

//     const tempFilePath = path.join(os.tmpdir(), `tempWithoutBackgroundImage-${docId}.png`);

//     const options = {
//       "method": "POST",
//       "hostname": "background-removal.p.rapidapi.com",
//       "port": null,
//       "path": "/remove",
//       "headers": {
//         "content-type": "application/x-www-form-urlencoded",
//         "x-rapidapi-key": "36fa4fef7bmsh2502fcc4e2d0992p1cde0ejsn8d1084773f7c",
//         "x-rapidapi-host": "background-removal.p.rapidapi.com",
//         "useQueryString": true
//       }
//     };

//     const req = http.request(options, function (res) {
//       const chunks = [];

//       res.on("data", function (chunk) {
//         // console.log('chunk:', chunk)
//         chunks.push(chunk);
//       });

//       res.on("end", function () {
//         // const body = Buffer.concat(chunks);
//         // fs.writeFileSync(tempFilePath, body);
//         // const body = Buffer.concat(chunks);
//         // const jsonResponse = JSON.parse(body.toString())
//         const body = Buffer.concat(chunks);
//         const jsonResponse = JSON.parse(body.toString())

//         // const jsonResponse = JSON.parse(body.chunk(''));

//         console.log('jsonResponse:',jsonResponse.response)

//         // an absolute path where you want to save the resulting image
//         fs.writeFileSync(tempFilePath, Buffer.from(jsonResponse.response.image_base64, 'base64'))

//         resolve(tempFilePath);
//       });
//     });

//     req.on('error', error => {
//       error(error);
//       reject(error)
//     });

//     req.write(qs.stringify({
//       // image_url: url,
//       image_base64 : img64,
//       output_format: 'base64',
//       to_remove: 'background',
//       color_removal: 'transparent'
//     }));

//     req.end();
//   })
// }

/// //////////////////////// HOTPOT ////////

const backgroundRemovalWithHotPot = ({ imagePath, docId }) => {
  return new Promise((resolve, reject) => {
    const form = new FormData()
    form.append("image", fs.createReadStream(imagePath))
    const customHeaders = {
      Authorization: HOTPOT_API_KEY,
    }
    const headers = { ...form.getHeaders(), ...customHeaders }
    const options = {
      method: "POST",
      hostname: "api-bin.hotpot.ai",
      port: 443,
      path: "/remove-background",
      headers: headers,
      encoding: null,
    }

    const tempHotpotFilePath = path.join(os.tmpdir(), `temphotpotImage-${docId}.png`)

    const request = https.request(options, (response) => {
      const body = []

      response.on("data", (chunk) => {
        body.push(Buffer.from(chunk))
      })

      response.on("end", () => {
        // change to a full file path where you want to save the resulting image
        fs.writeFileSync(tempHotpotFilePath, Buffer.concat(body), "binary")
        request.end()

        resolve(tempHotpotFilePath)
      })
    })

    request.on("error", (error) => {
      console.error(error)
      reject(error)
    })

    form.pipe(request)
  })
}
