const admin = require('firebase-admin')
const db = admin.firestore()
const FirebaseObject = require('./FirebaseObject')

module.exports = class ChallengeCollection extends FirebaseObject {

  constructor (state, {collection}) {
    super(state)
    if(state.challengeId && state.id){
      state.ref = db.collection('challenges').doc(state.challengeId).collection(collection).doc(state.id)
    }
    Object.assign(this, state)
  }

  // static fetch ({challengeId, id}) {
  //   const object = new ChallengeCollection
  // }


}

