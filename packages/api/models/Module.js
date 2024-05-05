
const FirebaseObject = require('./FirebaseObject')

module.exports = class Module extends FirebaseObject {
  static collectionPath ({ organisationId }) { return `organisations/${organisationId}/modules` }
  collectionPath () { return `organisations/${this.organisationId}/modules` }
}
