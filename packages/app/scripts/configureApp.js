// node scripts/generateApp.js &appId $build $withResources
// @appId
// Les valeurs sont dans le fichier apps.config.js
// Les resources sont dans le dossier resources/apps/${maracujaDomainId} /!\ Il peut etre different de l'organisationID
//
// @build ios | android | all
// @withResources 'withResources'

const updateReactEnv = require("./updateReactEnv")
const updateAndroid = require("./updateAndroid")
const appsConfig = require("../apps.config")
const updateCapacitorConfig = require("./updateCapacitorConfig")
const util = require("util")
const updateIos = require("./updateIos")
const updateResources = require("./updateResources")
const exec = util.promisify(require("child_process").exec)

const buildNumber = 221
const versionName = "1.32"

const maracujaDomainId = process.argv[2] || "testchallenge"
console.log("maracujaDomainId:", maracujaDomainId)
const buildMobile = process.argv[3]
const generateIconAndSplash = process.argv[4] === "withResources"

const { appId, organisationId, backgroundColor, appsUrls, appName, deepLinks, development } =
  appsConfig[maracujaDomainId]
console.log("appId:", appId)

const updateApp = async () => {
  await updateReactEnv({
    buildNumber,
    organisationId,
    appsUrls,
    development,
    deepLinks,
  })
  await updateCapacitorConfig({ appName, appId, backgroundColor })
}

;(async () => {
  await updateApp()
  if (buildMobile) {
    if (buildMobile === "android" || buildMobile === "all") {
      await updateAndroid({
        buildNumber,
        versionName,
        appId,
        deepLinks,
        appName,
        maracujaDomainId,
      })
    }
    if (buildMobile === "ios" || buildMobile === "all") {
      await updateIos({
        buildNumber,
        versionName,
        appId,
        deepLinks,
        appName,
        maracujaDomainId,
      })
    }
    await updateResources({ maracujaDomainId, generateIconAndSplash })

    console.log("App is building...")
    await exec(`yarn build${buildMobile === "all" ? "-mobile" : "-" + buildMobile}`)
    // if (buildMobile !== 'all') {
    //   await exec(`npx cap open ${buildMobile}`)
    //   console.log(`App is opening on ${buildMobile}`)
    // }
  } else {
    console.log("/! Configuration non activée sur mobile")
  }
})()
