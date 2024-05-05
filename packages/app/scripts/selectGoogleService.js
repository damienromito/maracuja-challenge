const fs = require('fs')
const path = require('path')

const iosFilePath = path.resolve(__dirname, '../resources/GoogleService-Info.plist')
const androidFilePath = path.resolve(__dirname, '../android/app/google-services.json')

const env = process.argv[2]
const envFolder = (env === 'development') ? 'development' : 'production'

const iosFileData = fs.readFileSync(`./resources/environment/${envFolder}/GoogleService-Info.plist`)
const androidFileData = fs.readFileSync(`./resources/environment/${envFolder}/google-services.json`)

fs.writeFileSync(iosFilePath, iosFileData)
fs.writeFileSync(androidFilePath, androidFileData)
