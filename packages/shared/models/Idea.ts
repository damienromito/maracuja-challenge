import FirebaseObject from "./FirebaseObject"
import IdeasBox from "./IdeasBox"


interface Idea {
  challengeId: string
  idea: string
  ideaBox: Partial<IdeasBox>
  // player: 

}
class Idea extends FirebaseObject implements Idea {
  static collectionPath({ challengeId }) {
    return `challenges/${challengeId}/ideas`
  }
  collectionPath() {
    return `challenges/${this.challengeId}/ideas`
  }
}

export default Idea
