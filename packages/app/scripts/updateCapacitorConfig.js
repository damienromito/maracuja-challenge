
const fs = require('fs').promises

const CAPACITOR_CONFIG = './capacitor.config.json'

exports = module.exports = async ({ appName, appId, backgroundColor }) => {
  const rawdata = await fs.readFile(CAPACITOR_CONFIG)
  const capacitorConfig = JSON.parse(rawdata)
  capacitorConfig.appName = appName
  capacitorConfig.appId = appId
  capacitorConfig.backgroundColor = backgroundColor
  capacitorConfig.server && delete capacitorConfig.server
  await fs.writeFile(CAPACITOR_CONFIG, JSON.stringify(capacitorConfig, null, 2))
  console.log('capacitor.config.json edited')
}
