const functions = require('firebase-functions').region('europe-west1')
const admin = require('firebase-admin')
// const spawn = require('child-process-promise').spawn;
const { updateDocFromResizedImage, transformAvatarWithoutBackground } = require('../utils/storage')
const path = require('path')
const os = require('os')
const fs = require('fs')
const https = require('https')
const db = admin.firestore()
const { debug, info, error, warn } = require('firebase-functions/lib/logger')

const runtimeOpts = {
  timeoutSeconds: 540,
  memory: '2GB'
}

exports = module.exports = functions.runWith(runtimeOpts).https.onCall(async (data, context) => {
  const bucket = admin.storage().bucket()

  const file = bucket.file('users/DJoziuvK74gOTv4KTfGHJkODeXy2/avatar.jpg')

  // return
  // const file = bucket.file('clubs/modelarvertclub17_17000_aeromodelisme/logo_120x120.jpg')
  // const file = bucket.file('users/tqgMK8sEg9R4A0fvW3URoy8FqyN2/avatar.jpg')
  // const file = bucket.file('users/jpYEG7kFCzZQ6XsooOQKydIdYW03/avatar.jpg')
  const tempFilePath = path.join(os.tmpdir(), path.basename(file.name))
  await file.download({ destination: tempFilePath })
  const object = file.metadata

  //= ========================================= onFinalize (object)

  info('OBJECT NAME ', object.name)
  // LOGO DES CLUBS
  if (object.name.startsWith('clubs/')) {
    if (object.metadata.resizedImage !== 'true') return
    await updateDocFromResizedImage(object, {
      collection: 'teams',
      challengeId: object.metadata.fromChallengeId,
      resized: true
    })
  }
  // info('object.metadata ',object.metadata )
  // //AVATAR JOUEURS
  // if(object.name.startsWith('users/')){
  //   if(object.metadata.resizedImage === 'true'){
  //     info('resizedImage = true , updateDocFromResizedImage to players ')

  //     await updateDocFromResizedImage(object, {
  //       collection : 'players',
  //       challengeId : object.metadata.fromChallengeId, resized : true
  //     })
  //   }else {

  //     if(object.metadata.transformed === 'remove-background'){
  //       info('transformed = remove-background , updateDocFromResizedImage to players ')
  //       await updateDocFromResizedImage(object, {
  //         collection : 'players',
  //         challengeId : object.metadata.fromChallengeId
  //       })
  //     } else if(object.metadata.transformationEnabled === 'true'){
  //       info('transformationEnabled = true ')

  //       await transformAvatarWithoutBackground(object)
  //     } else if(object.metadata.transformationEnabled === 'test'){
  //       info('transformationEnabled = test ')

  //       await updateDocFromResizedImage(object, {
  //         collection : 'players',
  //         challengeId : object.metadata.fromChallengeId,
  //         name : 'avatarTransformed'
  //       })
  //     }
  //   }
  //   return
  // }

  /// ////
  // if(object.metadata.resizedImage !== 'true') return

  // const fileExtension = path.extname(fileName)

  //

  // club/clubID/property_sizexsize

  // club/clubID/property {size : url}

  // console.log('file.publicUrl():', file.publicUrl())
  // const tempFilePath = path.join(os.tmpdir(), fileName);

  // DOWNLOAD IMAGE
  // console.log('Image downloaded locally to', tempFilePath);

  // console.log('filteExtension:', filteExtension)
  // console.log('dirname', filePath.split('/'))
  // const id = filePath.split('/')[1]
  // console.log('id:', id)
  // if(filePath.startsWith('clubs/')){
  //    console.log('fileName:',fileShortName)
  //    console.log('IS CLUB')
  //    if( fileShortName.endsWith('200x200')){
  //       console.log('RESIZE OK')

  //       //Save image to

  //       //Make public to get Image URL
  //     }
  //  }

  // await spawn('convert', [tempFilePath, '-thumbnail', '200x200>', tempFilePath]);
  // console.log('Thumbnail created at', tempFilePath);
  // await uploadToStorage({tempFilePath,contentType,filePath,fileName : 'thumb_' + fileName})

  // await uploadToStorage({
  //   tempFilePath : tempFilePath,
  //   contentType : 'image/jpeg',
  //   filePath : filePath,
  //   fileName : 'hello.png',
  // })

  // SAVE HotPotFile
  // const tempHotpotFilePath = await fetchImageWithoutBackground(tempFilePath)
  // await uploadToStorage({
  //   tempFilePath : tempHotpotFilePath,
  //   contentType : 'image/png',
  //   filePath : filePath,
  //   fileName : 'helloCopain.png',
  // })
})
