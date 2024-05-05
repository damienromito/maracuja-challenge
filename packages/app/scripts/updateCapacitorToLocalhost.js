const ip = require('ip')
const fs = require('fs')
const path = require('path')

const configPath = path.resolve(__dirname, '../capacitor.config.json')

const rawdata = fs.readFileSync(configPath)
const capacitorConfig = JSON.parse(rawdata)

const port = process.argv[2]
if (port) {
  capacitorConfig.server = {
    url: 'http://' + ip.address() + ':' + port,
    cleartext: true
  }
} else {
  delete capacitorConfig.server
}

// const isHotspotting = (
//   // console.log('isHotspotting:', ip.address())
//   // Samsung A5 + Macbook
//   ip.address() === '192.168.43.101' &&
//   process.env.NODE_ENV !== 'production'
// )

// if (isHotspotting) {
//   // support HMR on device
//   capacitorConfig.server.url = 'http://192.168.43.101:8013'
// }

fs.writeFileSync(configPath, JSON.stringify(capacitorConfig, null, 2))
