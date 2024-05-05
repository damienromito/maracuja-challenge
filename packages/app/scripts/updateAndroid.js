const fs = require("fs").promises

exports = module.exports = async ({ buildNumber, versionName, appId, deepLinks, appName, maracujaDomainId }) => {
  await copyGoogleServicesFile({ maracujaDomainId })
  await editGradleFile({ buildNumber, versionName, appId })
  await editAndroidManisfest({ appId, deepLinks })
  await editStringsXMLFile({ appId, appName })
  await editMainActivity({ appId })
  return true
}

const editAndroidManisfest = async ({ appId, deepLinks }) => {
  const PATH_FILE = "./android/app/src/main/AndroidManifest.xml"

  let newValue = await fs.readFile(PATH_FILE, "utf-8")
  newValue = newValue
    .replace(/(package=")(.*)(")/gm, `$1${appId}$3`)
    .replace(/(android:name=")(.*)(.MainActivity")/gm, `$1${appId}$3`)

  console.log(">><deepLinks:", deepLinks)
  if (deepLinks) {
    const androidLinks = deepLinks.map((deepLink) => {
      return `<data android:scheme="https" android:host="${deepLink}" />`
    })
    newValue = newValue.replace(/<data android:scheme=\"https\" android:host=\".*\" \/>/gm, androidLinks.join("\r\n"))
  }
  await fs.writeFile(PATH_FILE, newValue, "utf-8")
  console.log(">AndroidManifest.xml edited")

  return true
}

const editGradleFile = async ({ buildNumber, versionName, appId }) => {
  const PATH_FILE = "./android/app/build.gradle"
  const file = await fs.readFile(PATH_FILE, "utf-8")
  const newValue = file
    .replace(/(versionCode )(\d*)/gm, `$1${buildNumber}`)
    .replace(/(versionName ")(.*)(")/gm, `$1${versionName}$3`)
    .replace(/(applicationId ")(.*)(")/gm, `$1${appId}$3`)
  await fs.writeFile(PATH_FILE, newValue, "utf-8")
  console.log(`>Gradle file edited with version ${versionName}(${buildNumber})`)
  return true
}

const editStringsXMLFile = async ({ appName, appId }) => {
  const PATH_FILE = "./android/app/src/main/res/values/strings.xml"
  const file = await fs.readFile(PATH_FILE, "utf-8")
  const newValue = file
    .replace(/(<string name="app_name">)(.*)(<\/string>)/gm, `$1${appName}$3`)
    .replace(/(<string name="title_activity_main">)(.*)(<\/string>)/gm, `$1${appName}$3`)
    .replace(/(<string name="package_name">)(.*)(<\/string>)/gm, `$1${appId}$3`)
    .replace(/(<string name="custom_url_scheme">)(.*)(<\/string>)/gm, `$1${appId}$3`)

  await fs.writeFile(PATH_FILE, newValue, "utf-8")
  console.log(">strings.xml edited")
}

const editMainActivity = async ({ appId }) => {
  const PATH_SOURCE_FILE = "./resources/android/MainActivity.java"
  let PATH_FILE = "./android/app/src/main/java"
  await fs.rmdir(PATH_FILE, { recursive: true })
  await fs.mkdir(PATH_FILE)

  const directories = appId.match(/(.*)\.(.*)\.(.*)/)
  await fs.mkdir((PATH_FILE += "/" + directories[1]))
  await fs.mkdir((PATH_FILE += "/" + directories[2]))
  await fs.mkdir((PATH_FILE += "/" + directories[3]))

  const file = await fs.readFile(PATH_SOURCE_FILE, "utf-8")
  const newValue = file.replace(/(package )(.*)(;)/gm, `$1${appId}$3`)
  await fs.writeFile(PATH_FILE + "/MainActivity.java", newValue, "utf-8")
  console.log(">MainActivity.java created in at " + PATH_FILE)
}

const copyGoogleServicesFile = async ({ maracujaDomainId }) => {
  const file = await fs.readFile(`./resources/apps/${maracujaDomainId}/google-services.json`, "utf-8")
  await fs.writeFile("./android/app/google-services.json", file)
  console.log(">google-services.json updated")
}
