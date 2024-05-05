import { callApi } from "@maracuja/shared/helpers"
import FirebaseObject from "./FirebaseObject"

export const defaultIdeasBox = {
  name: "Boite à idées" as string,
  description:
    "Propose une idée de projets entre une entreprise de ton portefeuille et une startup présentée. Bonus : 1point / idée)" as string,
  startDate: new Date() as Date,
  endDate: new Date() as Date,
  phaseId: new Date() as Date,
}
interface IdeasBox {
  challengeId: string
  startDate: Date
  endDate: Date
  name: string
  phaseId: string
  description: string
}
class IdeasBox extends FirebaseObject implements IdeasBox {
  // challengeId: string
  // startDate: Date
  // endDate: Date

  static collectionPath({ challengeId }) {
    return `challenges/${challengeId}/ideasBoxes`
  }
  collectionPath() {
    return `challenges/${this.challengeId}/ideasBoxes`
  }

  constructor(props) {
    super(props)
    Object.assign(this, props)
    this.startDate = props.startDate?.toDate()
    this.endDate = props.endDate?.toDate()
  }

  static participate(data) {
    return callApi("apiIdeasBoxesParticipate", data)
  }
}

export default IdeasBox
