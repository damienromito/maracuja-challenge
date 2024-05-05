"use strict"

const functions = require("firebase-functions")
const admin = require("firebase-admin")
//console.dir(myObject, { depth: null });
admin.initializeApp({ storageBucket: functions.config().storage.bucket })
const settings = { ignoreUndefinedProperties: true }
const firestore = admin.firestore()
try {
  firestore.settings(settings)
} catch (e) {
  error(e)
}

const glob = require("glob")
const camelCase = require("camelcase")
const files = glob.sync("./**/*.f.js", { cwd: __dirname, ignore: "./node_modules/**" })
console.log("- Cloud functions loaded")
for (let f = 0, fl = files.length; f < fl; f++) {
  const file = files[f]
  const functionName = camelCase(file.slice(0, -5).split("/").join("_")) // Strip off '.f.js'
  if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === functionName) {
    exports[functionName] = require(file)
  }
}
