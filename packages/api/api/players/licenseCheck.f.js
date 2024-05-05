const functions = require('firebase-functions').region('europe-west1')
const admin = require('firebase-admin')
const { debug, info, error, warn } = require('firebase-functions/lib/logger')
const request = require('request')
const FFE_URL = 'https://ffecompet.ffe.com/secure-ws/licence-statut/'
const { errorResponse, successResponse } = require('../../utils/response')
const { Team, Club } = require('../../models')
const { objectSubset } = require('../../utils')
const { PLAYER_ROLES, ERROR_CODES } = require('../../constants/')
const { authOnCall } = require('../../utils/functions')

//License test
//2504324Q
//0204042D

const db = admin.firestore()
exports = module.exports = authOnCall({ auth: false }, async (data, context) => {
  let { licenseNumber, challengeId } = data
  licenseNumber = licenseNumber.toUpperCase().trim()

  if (!licenseNumber.match(/^\d{7}\D$/)) {
    return errorResponse({ code: ERROR_CODES.WRONG_FORMAT, message: "Le format de licence n'est pas correct." })
  }

  if (['1234567M', '7654321W', '1234567C'].includes(licenseNumber)) {
    debug('Admin Licence detected ', licenseNumber)
    const club = await Club.fetch({ id: licenseNumber === '7654321W' ? 'whynotfactory_75010_autres' : 'maracujateam_33100_autre' })
    const licensee = { licenseNumber }
    if (licenseNumber === '1234567C') {
      licensee.roles = [PLAYER_ROLES.CAPTAIN]
    }
    const response = { exists: true, club, licensee }
    return successResponse(response)
  }

  let token
  try {
    token = await getToken()
  } catch (error) {
    error('getToken from ffe failed', data, err)
    return errorResponse({ code: ERROR_CODES.UNDEFINED, message: "Une erreur est survenue. Si le problème persiste, merci d'envoyer une capture d'écrann à admin@maracuja.ac" })
  }

  if (token === '' || token.length > 300 || token.match(/.*(502 Bad Gateway).*/gm)) {
    // FFE Web Service down entre 00:45 et 3h, on accepte tout !
    info('FFE Web Service down : ', licenseNumber, token)
    const response = { exists: true, licensee: { licenseNumber } }
    return successResponse(response)
  }

  const licensee = await fetchLicenseInfo({ licenseNumber, token })
  if (!licensee) {
    return successResponse({ message: 'Ce numéro de licence n\'existe pas.', code: ERROR_CODES.NOT_EXISTS, exists: false })
  }
  const alreadySubscribed = await licenseNumberIsAlreadySubscribed({ licenseNumber, challengeId })

  if (alreadySubscribed) {
    return successResponse({
      message: 'Un compte est déjà inscrit avec ce numéro de licence.',
      code: 'license/already-used',
      exists: true
    })
  }else {
    const response = { licensee, exists: true }
    const team = await Team.fetchByProperty({ challengeId, propertyKey: 'ffeClubNumber', propertyValue: licensee.numClub })
    let club
    if (team) {
      response.team = team
    }else {
      club = await Club.fetchByProperty({ propertyKey: 'ffeClubNumber', propertyValue: licensee.numClub })
      if (club) {
        response.club = objectSubset(club, ['name', 'id', 'members', 'logo', 'department', 'region', 'ffeClubNumber'])
      }else {
        const message = 'Le numéro du club ne correspond à aucun club enregistré'
        error(message, { licensee, challengeId })
        return errorResponse({ code: ERROR_CODES.NOT_EXISTS, message })
      }
    }
    return successResponse(response)
  }
})

const getToken = () => {
  return new Promise((resolve, reject) => {
    const password = 'wAKi+6>24'
    const service = 'https://challenge.maracuja.ac/'
    const username = 'ws-maracuja'
    const opts = {
      url: 'https://ffecompet.ffe.com/secure-ws/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Maracuja App'
      },
      form: {
        service,
        password,
        username
      }
    }

    request.post(opts, (err, response, body) => {
      if (err) {
        reject(new Error(err))
      }
      resolve(body)
    })
  })
}

const licenseNumberIsAlreadySubscribed = async ({ challengeId, licenseNumber }) => {
  const playerSnap = await db.collection('challenges').doc(challengeId).collection('players')
    .where('licenseNumber', '==', licenseNumber).get()
  if (playerSnap.empty) {
    return false
  } else {
    return true
  }
}

const fetchLicenseInfo = ({ licenseNumber, token }) => {
  const opts = {
    url: FFE_URL + licenseNumber,
    headers: {
      Authorization: 'Bearer ' + token,
      'User-Agent': 'Maracuja App'
    }
  }

  return new Promise((resolve, reject) => {
    request.get(opts, (err, response, body) => {
      if (err || body === '"KO"') {
        resolve(false)
      } else {
        let licensee
        if (body.length > 500) {
          info('FFE Web Service down (get licence): ', licenseNumber)

          licensee = { licenseNumber }
        }else {
          const data = JSON.parse(body)
          const birthdaySplitted = data.Licence.Birthday.split('/')
          const birthday = new Date(birthdaySplitted[1] + '/' + birthdaySplitted[0] + '/' + birthdaySplitted[2])

          licensee = {
            firstName: data.Licence.FirstName.charAt(0).toUpperCase() + data.Licence.FirstName.toLowerCase().slice(1),
            birthday: birthday.toISOString(),
            numClub: data.Licence.numClub,
            licenseNumber
          }
          if (data.Enseignant === 'OK') {
            licensee.roles = [PLAYER_ROLES.CAPTAIN]
          }
        }
        resolve(licensee)
      }
    })
  })
}
