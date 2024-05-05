import "firebase/firestore"
import Theme from "./Theme"
import FirebaseObject from "./FirebaseObject"
import { callApi, mapToArray } from "@maracuja/shared/helpers"

class Module extends FirebaseObject {
  // static documentPath ({ challengeId, id }) { return `challenges/${challengeId}/teams/${id}` }
  static collectionPath({ organisationId }) {
    return `organisations/${organisationId}/modules`
  }
  collectionPath() {
    return `organisations/${this.organisationId}/modules`
  }

  constructor(props) {
    super(props)
    Object.assign(this, props)
    if (props.themes) {
      this.themes = mapToArray(props.themes, { toArray: true, sortedByProp: "name", initializer: (o) => new Theme(o) })
    }
  }

  static create({ name, organisationId }) {
    return callApi("apiModulesCreate", { name, organisationId })
  }
}

export default Module
