const FirebaseObject = require('./FirebaseObject')

module.exports = class Organisation extends FirebaseObject {
  static collectionPath () { return 'organisations' }
  collectionPath () { return 'organisations' }
}
