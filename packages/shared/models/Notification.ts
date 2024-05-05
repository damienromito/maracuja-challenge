import 'firebase/firestore'
import { callApi } from '../helpers'
import FirebaseObject from './FirebaseObject'

class Notification extends FirebaseObject {
  static collectionPath({ challengeId }) { return `challenges/${challengeId}/notifications` }
  collectionPath() { return `challenges/${this.challengeId}/notifications` }

  constructor(props) {
    super(props)
    Object.assign(this, props)
    props.scheduledDate && (this.scheduledDate = props.scheduledDate.toDate())
    props.sentAt && (this.sentAt = props.sentAt.toDate())
  }

  static async setForAnimation(params) {
    // params.sendNow = true
    if (params.scheduledDate) {
      params.scheduledDate = params.scheduledDate.toISOString()
    }
    const response = await callApi('apiNotificationsSetForAnimation', params)
    return response?.stats
  }
}

export default Notification
