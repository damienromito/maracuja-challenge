import { callApi } from "@maracuja/shared/helpers"
import "firebase/firestore"
import FirebaseObject from "./FirebaseObject"
import Question from "./Question"

class Themes extends FirebaseObject {
  static collectionPath({ organisationId }) {
    return `organisations/${organisationId}/themes`
  }
  collectionPath() {
    return `organisations/${this.organisationId}/themes`
  }

  static create({ name, organisationId, moduleId }) {
    return callApi("apiThemesCreate", { name, organisationId, moduleId })
  }

  constructor(props) {

    super(props)
    Object.assign(this, props)

    if (props.questions) {
      this.questions = props.questions.map((q) => new Question(q))
    }
  }

  static async fetchAllFromModules({ modules }) {
    if (!modules) {
      return []
    }
    const themes = []
    for (const module of modules) {
      const moduleThemes = await Themes.fetchAll(
        { organisationId: module.organisationId },
        {
          refHook: (ref) => ref.where("module.id", "==", module.id),
        }
      )
      themes.push(...moduleThemes)
    }
    return themes
  }
}

export default Themes
