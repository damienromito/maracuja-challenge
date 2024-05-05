const FirebaseObject = require('./FirebaseObject')

module.exports = class Ranking extends FirebaseObject {
  static collectionPath ({ challengeId }) { return `challenges/${challengeId}/rankings` }
  collectionPath () { return `challenges/${this.challengeId}/rankings` }

  constructor (data) {
    super(data)
    if (data) {
      data.createdAt = data.createdAt?.toDate()
      data.editedAt = data.editedAt?.toDate()
      Object.assign(this, data)
    }
  }
}
