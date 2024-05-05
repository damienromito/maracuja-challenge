import { generateId } from "../../dashboard/src/helpers"
import FirebaseObject from "./FirebaseObject"
import firebase from "firebase/app"
import { callApi } from "@maracuja/shared/helpers"
import { USER_ROLES } from "../constants"
import Challenge from "./Challenge"
import User from "./User"


interface Organisation {

}

class Organisation extends FirebaseObject implements Organisation {
  static collectionPath() {
    return "organisations"
  }
  collectionPath() {
    return "organisations"
  }

  constructor(props) {
    super(props)
    if (props) {
      Object.assign(this, props)
      if (!props.dynamicLinkHost) {
        this.dynamicLinkHost = process.env.REACT_APP_DYNAMIC_LINK_HOST
      }
      if (props.challenges) {
        this.challenges = Object.keys(props.challenges)
          .map((key) => {
            const challenge = props.challenges[key]
            challenge.id = key
            return new Challenge(challenge)
          })
          .sort((a, b) => {
            return b.startDate - a.startDate
          })
      }

    }
  }

  fetchAdmins = ({ listener } = {}) => {
    return User.fetchAll(
      {},
      {
        refHook: (ref) => {
          return ref.where(`organisations.${this.id}.roles`, "array-contains", USER_ROLES.ADMIN)
        },
        listener: listener,
      }
    )
  }

  addAdmin({ email, challengeId, role, existingUserId, firstName }) {
    return callApi("apiUsersCreateAdmin", {
      email,
      challengeId,
      organisationId: this.id,
      role,
      firstName,
      existingUserId,
    })
  }

  static fetchAll({ ids }) {
    return super.fetchAll(null, {
      refHook: (ref) => {
        return ids ? ref.where(firebase.firestore.FieldPath.documentId(), "in", ids) : ref
      },
    })
  }
}

export default Organisation
