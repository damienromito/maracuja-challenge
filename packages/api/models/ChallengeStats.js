const { MARACUJA_CLUB_ID } = require("../constants")
const FirebaseObject = require("./FirebaseObject")

module.exports = class ChallengeStats extends FirebaseObject {
  static collectionPath() {
    return "stats/challenges/list"
  }
  collectionPath() {
    return "stats/challenges/list"
  }

  static update({ teamId = false, id }, data) {
    if ((!teamId || teamId !== MARACUJA_CLUB_ID) && Object.keys(data).length) {
      return super.update({ id }, data)
    }
  }
}
