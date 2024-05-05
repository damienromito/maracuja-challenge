const admin = require("firebase-admin")
const { objectSubset } = require("../utils")
const { addContactInList } = require("../utils/emails/mailjet")
const FirebaseObject = require("./FirebaseObject")
const Image = require("./Image")
const db = admin.firestore()

module.exports = class Player extends FirebaseObject {
  // ref = ({challengeId, teamId}) => db.collection("challenges").doc(challengeId).collection('teams').doc(teamId)
  static collectionPath({ challengeId }) {
    return `challenges/${challengeId}/players`
  }
  collectionPath() {
    return `challenges/${this.challengeId}/players`
  }

  constructor(data) {
    super(data, { collection: "players" })
    if (data) {
      data.createdAt = data.createdAt?.toDate()
      data.editedAt = data.editedAt?.toDate()
    }
    if (data.members) {
      // state.members && (state.members = Object.keys(state.members).map(key => state.members[key]))
    }

    Object.assign(this, data)
  }

  getAvatar(size = "small") {
    if (!this.avatar) return undefined

    switch (size) {
      case "small":
        return this.avatar["100"] || this.avatar.original

      case "medium":
        return this.avatar["400"] || this.avatar.original

      case "large":
        return this.avatar.original
    }
  }

  update(data, { batch } = {}) {
    let ref = db.collection("challenges").doc(this.challengeId).collection("players").doc(this.id)
    if (batch) {
      batch.update(ref, data)
    }
    return ref.update(data)
  }

  getActivityScore({ phaseId, id, type }) {
    return this.scores?.[phaseId]?.[`${type}s`]?.[id]?._stats
  }

  getContestScore({ phaseId, id }) {
    return this.scores?.[phaseId]?.contests?.[id]?._stats
  }

  static fetchByProperty = async ({ challengeId, propertyKey, propertyValue, returnFirstElem = true }) => {
    return await FirebaseObject.fetchByProperty({
      collectionKey: "challenges",
      collectionDocId: challengeId,
      subCollectionKey: "players",
      propertyKey,
      propertyValue,
      returnFirstElem,
    })
  }

  static fetchDeviceIdIdenticalCount = async ({ deviceId, challengeId, currentPlayerId }) => {
    if (!deviceId || deviceId === "VIRTUAL") return 0
    let queryRef = db.collection("challenges").doc(challengeId).collection("players").where("deviceId", "==", deviceId)
    if (currentPlayerId) {
      queryRef = queryRef.where(admin.firestore.FieldPath.documentId(), "!=", currentPlayerId)
    }
    const playersWithIpSnap = await queryRef.get()
    return playersWithIpSnap.size
  }

  static async subscribeToChallengeTips({ mailjetListId, player, challengeId, transactionalOnly = false }, returnId = false) {
    //CREATE MAILJET IN LIST
    const mailjetContactId = await addContactInList({
      listId: Number(mailjetListId),
      transactionalOnly,
      player: objectSubset(player, ["id", "email", "username", "lastName", "firstName", "club", "platform", "roles"]),
    })
    if (mailjetContactId) {
      if (returnId) {
        return mailjetContactId
      } else {
        const newPlayer = {
          mailjetContactId: mailjetContactId,
          ["notifications.email.news"]: true,
        }
        return Player.update({ challengeId, id: player.id }, newPlayer)
      }
    } else {
      return false
    }
  }
}
