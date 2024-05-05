
const fs = require('fs').promises

exports = module.exports = async ({ buildNumber, organisationId, appsUrls, development, deepLinks }) => {
  const ENV_REACT_PATH = './.env'

  console.log('Update .env file for :')
  let newValue = await fs.readFile(ENV_REACT_PATH, 'utf-8')
  newValue = newValue.replace(/(REACT_APP_VERSION=)([\d]*)/gm, `$1${buildNumber}`)
  console.log(`>REACT_APP_VERSION=${buildNumber}`)

  // newValue = newValue.replace(/(REACT_APP_ANDROID_URL=)(.*)/gm, `$1${appsUrls.android}`)
  // console.log(`>REACT_APP_ANDROID_URL=${appsUrls.android}`)

  // newValue = newValue.replace(/(REACT_APP_IOS_URL=)(.*)/gm, `$1${appsUrls.ios}`)
  // console.log(`>REACT_APP_IOS_URL=${appsUrls.ios}`)

  const env = development ? 'development' : 'production'
  newValue = newValue.replace(/(REACT_APP_ENV=)(.*)/gm, `$1${env}`)
  console.log(`>REACT_APP_ENV=${env}`)

  // newValue = newValue.replace(/(REACT_APP_DYNAMIC_LINK_HOST=)(.*)/gm, `$1${deepLinks[0]}`)
  // console.log(`>REACT_APP_IOS_URL=${appsUrls.ios}`)

  // newValue = newValue.replace(/REACT_APP_ORGA=(.*)([\r\n]?)/gm, '$2')
  // console.log('newValue:', newValue)
  // if (organisationId) {
  //   newValue = `REACT_APP_ORGA=${organisationId}\r\n` + newValue
  //   console.log(`>REACT_APP_ORGA=${organisationId}`)
  // }

  await fs.writeFile(ENV_REACT_PATH, newValue, 'utf-8')
}
