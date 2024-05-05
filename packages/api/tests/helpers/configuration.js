
const getTester = () => {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8081'

  return require('firebase-functions-test')({
    databaseURL: 'localhost:8081',
    // databaseURL: 'https://english-challenge-test.firebaseio.com',
    storageBucket: 'english-challenge-testappspot.com',
    projectId: 'english-challenge-test'
  }, '.local/maracuja-challenge-dev.json')
}

module.exports = {
  getTester
}
