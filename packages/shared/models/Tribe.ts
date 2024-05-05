
import firebase from 'firebase/app'
import 'firebase/firestore'
import { fetchListRef } from '../api/helpers'

class Tribe {
  constructor(props) {
    Object.assign(this, props)
  }

  // static fetch (id) {
  //   firebase.firestore().doc(`tribeTypes/${id}`)
  // }

  static fetchAll() {
    const tribesRef = firebase.firestore().collection('tribeTypes')
    return fetchListRef(tribesRef)
  }
}

export default Tribe
