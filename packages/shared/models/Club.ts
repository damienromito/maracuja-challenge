import 'firebase/firestore'
import FirebaseObject from './FirebaseObject'
import Image from './Image'

class Club extends FirebaseObject {
  static collectionPath() { return 'clubs' }
  collectionPath() { return 'clubs' }

  constructor(props) {
    super(props)
    Object.assign(this, props)
    if (props) {
      this.logo && (this.logo = new Image(props.logo))
    }
  }
}

export default Club
