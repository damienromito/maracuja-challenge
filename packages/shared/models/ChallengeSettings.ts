
import { arrayFromObjects } from '../api/helpers'
import FirebaseObject from './FirebaseObject'
import User from './User'

interface ChallengeSettings {
  staff: []
}

class ChallengeSettings extends FirebaseObject implements ChallengeSettings {

  challengeId: string = ""
  // staff: any[] 

  static collectionPath({ challengeId }: any) { return `challenges/${challengeId}/settings` }
  collectionPath() { return `challenges/${this.challengeId}/settings` }

  constructor(props: any) {
    super(props)
    Object.assign(this, props)
    if (props) {
      if (props.staff) {
        this.staff = arrayFromObjects({ objects: props.staff, initializer: (data: any) => new User(data) })
      }
    }
  }

}



export default ChallengeSettings
