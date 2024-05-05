const FirebaseObject = require('./FirebaseObject')

module.exports = class Phase extends FirebaseObject {
  static collectionPath ({ challengeId }) { return `challenges/${challengeId}/phases` }
  collectionPath () { return `challenges/${this.challengeId}/phases` }

  constructor (data) {
    if (data) {
      data.startDate = data.startDate?.toDate()
      data.endDate = data.endDate?.toDate()
      data.createdAt = data.createdAt?.toDate()
      data.editedAt = data.editedAt?.toDate()
    }
    super(data)
  }
}
