import Activity from './Activity'
import FirebaseObject from './FirebaseObject'



interface Survey {
  challengeId: string
  startDate: Date
  endDate: Date
  name: string
  preview: string,
  // phaseId: string
  formEditionUrl: string
  formId: string
  formUrl: string
  prefilledPlayerIdField?: number
  actionButtonText?: string
  authorizedTeams?: string[]
}
class Survey extends FirebaseObject implements Survey {

  static collectionPath({ challengeId }) { return `challenges/${challengeId}/surveys` }
  collectionPath() { return `challenges/${this.challengeId}/surveys` }

  constructor(props) {
    super(props)
    Object.assign(this, props)
    this.startDate = props.startDate?.toDate()
    this.endDate = props.endDate?.toDate()
    if (props.formUrl) {
      this.formId = props.formUrl.match(/\/d\/e\/(.*)\/.*/)[1]
    }
  }

}

export default Survey
