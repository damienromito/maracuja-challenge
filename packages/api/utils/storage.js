const admin = require('firebase-admin')
const db = admin.firestore()
const path = require('path')
const os = require('os')
const fs = require('fs')
const https = require('https')
const { v4 } = require('uuid')
const { debug, info, error, warn } = require('firebase-functions/lib/logger')
const { objectSubset } = require('.')

const hotpotApiKey = HOTPOT_API_KEY

const updateDocFromResizedImage = async (image, { collection, challengeId, resized, name = null }) => {
  const filePath = image.name
  const url = 'https://firebasestorage.googleapis.com/v0/b/' + image.bucket + '/o/' + encodeURIComponent(filePath) + '?alt=media&token=' + image.metadata.firebaseStorageDownloadTokens
  const extName = path.extname(filePath)
  // const fileName = path.basename(filePath)
  const baseName = name || path.basename(filePath, extName)
  const folders = filePath.split('/')

  const documentId = folders[1]

  const documentRef = db.collection('challenges').doc(challengeId).collection(collection).doc(documentId)
  const docUpdates = {}

  if (collection === 'teams') {
    docUpdates.lastActionAt = admin.firestore.Timestamp.now()
  }

  if (resized) {
    const baseNameInfos = baseName.match(/(.*)_([0-9]*)x([0-9]*)/i)
    const property = baseNameInfos[1]
    const size = baseNameInfos[2]
    docUpdates[`${property}.${size}`] = url
  } else {
    docUpdates[`${baseName}.original`] = url
  }

  return await documentRef.update(docUpdates)
}

const uploadToStorage = async ({ contentType, filePath, fileName, tempFilePath, customMetadata = {} }) => {
  const bucket = admin.storage().bucket()
  const newFilePath = path.join(path.dirname(filePath), fileName)
  const firebaseStorageDownloadTokens = v4()
  const options = {
    destination: newFilePath,
    metadata: { contentType, metadata: { ...customMetadata, firebaseStorageDownloadTokens } },
    public: true
  }
  const uploadResponse = await bucket.upload(tempFilePath, options)
  const file = uploadResponse[0]
  // Once the thumbnail has been uploaded delete the local file to free up disk space.
  await fs.unlinkSync(tempFilePath)
  return file
}

const transformAvatarWithoutBackground = async (image) => {
  const bucket = admin.storage().bucket()
  const filePath = image.name
  const docId = filePath.split('/')[1]
  info('Will remove background', filePath)
  const tempFilePath = path.join(os.tmpdir(), path.basename(filePath))
  await bucket.file(filePath).download({ destination: tempFilePath })

  // REMOVE BACKGOURND
  const tempHotpotFilePath = await fetchImageWithoutBackground(tempFilePath, docId)

  await uploadToStorage({
    tempFilePath: tempHotpotFilePath,
    contentType: 'image/png',
    filePath: filePath,
    fileName: 'avatarTransformed.png',
    customMetadata: {
      transformed: 'remove-background',
      ...objectSubset(image.metadata, ['fromChallengeId'])
    }
  })
  return true
}

const fetchImageWithoutBackground = (tempFilePath, docId) => {
  return new Promise((resolve, reject) => {
    // HOTPOT
    const tempHotpotFilePath = path.join(os.tmpdir(), `temphotpotImage-${docId}.png`)

    const imageData = JSON.stringify({
      imageBase64: fs.readFileSync(tempFilePath, 'base64')
    })

    const options = {
      method: 'POST',
      hostname: 'api-bin.hotpot.ai',
      port: 443,
      path: '/remove-background',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': hotpotApiKey
      }
    }

    const request = https.request(options, response => {
      response.setEncoding('utf-8')
      const body = []
      debug('start HotPot api call')
      response.on('data', chunk => {
        body.push(chunk)
      })
      response.on('end', () => {
        //  debug('HotPot image ready')

        const jsonResponse = JSON.parse(body.join(''))
        console.log('jsonResponse:', jsonResponse)
        // an absolute path where you want to save the resulting image
        fs.writeFileSync(tempHotpotFilePath, Buffer.from(jsonResponse.imageBase64, 'base64'))
        resolve(tempHotpotFilePath)
      })
    })

    request.on('error', error => {
      error(error)
      reject(error)
    })

    request.write(imageData)
    request.end()
  })
}

module.exports = {
  updateDocFromResizedImage,
  uploadToStorage,
  fetchImageWithoutBackground,
  transformAvatarWithoutBackground
}
