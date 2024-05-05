const express = require('express')
const path = require('path')
// let sslRedirect = require('heroku-ssl-redirect')
const port = process.env.PORT || 8080
const app = express()
// app.use(sslRedirect())
// the __dirname is the current directory from where the script is running
app.use(express.static(path.resolve(__dirname, 'dist')))
app.get('*', function (req, res) {
  res.sendFile('index.html', { root: path.resolve(__dirname, 'build') })
})
app.listen(port)
