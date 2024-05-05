const { debug, info, error, warn } = require('firebase-functions/lib/logger')
const functions = require('firebase-functions').region('europe-west1')
const { updateDocFromResizedImage, transformAvatarWithoutBackground } = require('../utils/storage')

exports = module.exports = functions.storage.object().onFinalize(async (object) => {
  // info('OBJECT NAME ',object.name)
  // LOGO DES CLUBS
  if (object.name.startsWith('clubs/')) {
    if (object.metadata.resizedImage !== 'true') return
    await updateDocFromResizedImage(object, {
      collection: 'teams',
      challengeId: object.metadata.fromChallengeId,
      resized: true
    })
    return
  }

  // info('Transformation ',object.metadata.transformationEnabled )
  // AVATAR JOUEURS
  if (object.name.startsWith('users/')) {
    if (object.metadata.resizedImage === 'true' && object.metadata.transformationEnabled !== 'true') {
      await updateDocFromResizedImage(object, {
        collection: 'players',
        challengeId: object.metadata.fromChallengeId,
        resized: true
      })
    }
  }
})
