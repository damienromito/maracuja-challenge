const admin = require("firebase-admin")
const { objectSubset } = require("../utils")
const FirebaseObject = require("./FirebaseObject")
const db = admin.firestore()
const fieldValue = admin.firestore.FieldValue

module.exports = class QuestionSet extends FirebaseObject {
  static collectionPath({ challengeId }) {
    return `challenges/${challengeId}/questionSets`
  }
  collectionPath() {
    return `challenges/${this.challengeId}/questionSets`
  }

  static ref = ({ challengeId, questionSetId }) => db.collection("challenges").doc(challengeId).collection("questionSets").doc(questionSetId)

  constructor(data) {
    if (data) {
      data.startDate = data.startDate?.toDate()
      data.endDate = data.endDate?.toDate()
      data.createdAt = data.createdAt?.toDate()
      data.editedAt = data.editedAt?.toDate()
    }
    super(data)
  }

  buildForApi() {
    this.startDate = this.startDate.toISOString()
    this.editedAt && (this.editedAt = this.editedAt.toISOString()) // TODO to remove 'this.editedAt &&'
    this.createdAt = this.createdAt.toISOString()
    this.endDate = this.endDate.toISOString()
    this.questions.map((q) => {
      delete q.createdAt
      delete q.editedAt
    })
  }

  static fetchTeamExclusive = async ({ challengeId, teamId, type }) => {
    let questionSetsRef = db.collection("challenges").doc(challengeId).collection("questionSets")
    questionSetsRef = questionSetsRef.where("authorizedTeams", "array-contains", teamId).where("type", "=", type)
    const questionSets = await FirebaseObject.fetchListRef(questionSetsRef)
    return questionSets[0]
  }

  static fetchTeamExclusive = async ({ challengeId, teamId, type }) => {
    let questionSetsRef = db.collection("challenges").doc(challengeId).collection("questionSets")
    questionSetsRef = questionSetsRef.where("authorizedTeams", "array-contains", teamId).where("type", "=", type)
    const questionSets = await FirebaseObject.fetchListRef(questionSetsRef)
    return questionSets[0]
  }

  static addQuestion = async ({ challengeId, questionSetId, question }) => {
    let questionSetRef = QuestionSet.ref({ challengeId, questionSetId })
    const newQuestionSet = {
      questions: fieldValue.arrayUnion(question),
    }
    const response = await questionSetRef.update(newQuestionSet)
    return true
  }
}
