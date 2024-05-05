import "firebase/firestore"
import FirebaseObject from "./FirebaseObject"

export interface PhasePreview {
  id: string
  name: string
  startDate: Date
}
class Phase extends FirebaseObject implements Phase {

  challengeId = ''
  id = ''

  // static documentPath ({ challengeId, id }) { return `challenges/${challengeId}/teams/${id}` }
  static collectionPath({ challengeId }) {
    return `challenges/${challengeId}/phases`
  }
  collectionPath() {
    return `challenges/${this.challengeId}/phases`
  }

  constructor(props) {
    super(props)
    Object.assign(this, props)
    this.startDate = props.startDate?.toDate()
    this.endDate = props.endDate?.toDate()

  }
}

export default Phase

interface PhaseCaptainCapabilities {
  colors: boolean
  logo: boolean
  name: boolean
}

interface PhaseRankingStats {
  captainCount: boolean
  ideaCount: boolean
  playerCount: boolean
  progression: boolean
  refereeCount: boolean
  score: boolean
}


interface Phase {
  createdAt: Date
  editedAt: Date
  challengeId: string
  captainEditTeam: PhaseCaptainCapabilities
  description?: string
  displayedFilter?: string
  startDate: Date
  endDate: Date
  holdAuthorizedClubs: boolean
  isFinale: boolean
  name: string
  priceCount: number
  ranking: { focusedOnCurrentTeam: boolean }
  rankingFilters: []
  rankingStats: PhaseRankingStats
  signupDisabled: boolean
  trainingCount: number
}
