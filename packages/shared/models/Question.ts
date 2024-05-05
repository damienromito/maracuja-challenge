interface Question {
  content?: string
  type: string
  text: string
}
class Question implements Question {
  constructor(props) {
    Object.assign(this, props)
    if (props.createdAt) {
      this.createdAt = props.createdAt.toDate()
    }
    if (props.editedAt) {
      this.editedAt = props.editedAt.toDate()
    }
  }
}


export default Question
