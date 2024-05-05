import Activity from './Activity'
import { callApi } from '@maracuja/shared/helpers'

class Event extends Activity {
  static collectionPath({ challengeId }) { return `challenges/${challengeId}/events` }
  collectionPath() { return `challenges/${this.challengeId}/events` }

  constructor(props) {
    super(props)
    Object.assign(this, props)

    if (props) {
      this.eventStartDate = props.eventStartDate?.toDate()
      this.eventEndDate = props.eventEndDate?.toDate()
    }
  }

  static getDefaultValues() {
    return {
      reward: 1,
      title: '',
      eventStartDate: new Date(),
      eventEndDate: new Date(),
      image: ''
    }
  }

  static subscribeEvent(data) {
    return callApi('apiEventsSubscribe', data)
  }
}

export default Event
