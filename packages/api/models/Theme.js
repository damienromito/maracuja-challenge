
const FirebaseObject = require('./FirebaseObject')

module.exports = class Themes extends FirebaseObject {
  static collectionPath ({ organisationId }) { return `organisations/${organisationId}/themes` }
  collectionPath () { return `organisations/${this.organisationId}/themes` }
}
