
const fs = require('fs').promises

exports = module.exports = async ({ buildNumber, versionName, appId, deepLinks, appName, maracujaDomainId }) => {
  await copyGoogleServicesFile({ maracujaDomainId })
  await editInfoPlist({ appName, appId })
  await editXPROJ({ appName, appId, buildNumber, versionName })
  await editAssociatedDomains({ deepLinks })

  return true
}

const editInfoPlist = async ({ appId, appName }) => {
  const PATH_FILE = './ios/App/App/Info.plist'
  const file = await fs.readFile(PATH_FILE, 'utf-8')

  const newValue = file
    .replace(/(<key>CFBundleDisplayName<\/key>\n.*<string>)(.*)(<\/string>)/gm, `$1${appName.replace(' ', '&#x2007;')}$3`)

  await fs.writeFile(PATH_FILE, newValue, 'utf-8')
  console.log('>Info.plist edited')

  return true
}

const editXPROJ = async ({ appId, appName, buildNumber, versionName }) => {
  const PATH_FILE = './ios/App/App.xcodeproj/project.pbxproj'
  const file = await fs.readFile(PATH_FILE, 'utf-8')
  const newValue = file
    .replace(/(PRODUCT_BUNDLE_IDENTIFIER = )(.*)(;)/gm, `$1${appId}$3`)
    .replace(/(MARKETING_VERSION = )(.*)(;)/gm, `$1${versionName}$3`)
    .replace(/(CURRENT_PROJECT_VERSION = )(.*)(;)/gm, `$1${buildNumber}$3`)

  await fs.writeFile(PATH_FILE, newValue, 'utf-8')
  console.log('>project.pbxproj edited')

  return true
}

const copyGoogleServicesFile = async ({ maracujaDomainId }) => {
  console.log('maracujaDomainId:', maracujaDomainId)
  const file = await fs.readFile(`./resources/apps/${maracujaDomainId}/GoogleService-Info.plist`, 'utf-8')
  await fs.writeFile('./ios/App/App/GoogleService-Info.plist', file)
  console.log('>GoogleService updated')
}

const editAssociatedDomains = async ({ deepLinks }) => {
  const PATH_FILE = './ios/App/App/App.entitlements'
  const file = await fs.readFile(PATH_FILE, 'utf-8')
  const newValue = file
    .replace(/(<string>applinks:)(.*)(<\/string>)/gm, `$1${deepLinks[0]}$3`)
  await fs.writeFile(PATH_FILE, newValue, 'utf-8')
  console.log('>dynamic link updateed')
}
