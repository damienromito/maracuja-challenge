import { callApi } from "@maracuja/shared/helpers"
import "firebase/firestore"
import FirebaseObject from "./FirebaseObject"

// user = id => firebase.firestore().doc(`users/${id}`)
// users = () => firebase.firestore().collection('users')

class WhitelistMember extends FirebaseObject {
  static collectionPath({ challengeId }) {
    return `challenges/${challengeId}/whitelistMembers`
  }
  collectionPath() {
    return `challenges/${this.challengeId}/whitelistMembers`
  }

  constructor(props) {
    super(props)
    Object.assign(this, props)

    if (props) {
      if (props.subscribedAt?.toDate) {
        this.subscribedAt = props.subscribedAt.toDate()
      }

      // Object.assign(this, data)
    }
  }

  static updateMembers({ challengeId, membersToUpdate }) {
    return callApi("apiWhitelistUpdate", { challengeId, membersToUpdate })
  }

  static sendSubscriptionEmail({ challengeId, retry = false, testMembers }) {
    return callApi("apiWhitelistSendSubscriptionEmail", { challengeId, retry, testMembers })
  }

  static sendSubscriptionSms({ challengeId, retry = false, testMembers }) {
    return callApi("apiWhitelistSendSubscriptionSms", { challengeId, retry, testMembers })
  }
}

export default WhitelistMember
