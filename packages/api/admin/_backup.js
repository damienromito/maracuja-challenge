const functions = require('firebase-functions').region('europe-west1')
const backup = require('../utils/backup');

 
exports = module.exports = functions.https.onRequest((req, res) => {

  return backup()
});
