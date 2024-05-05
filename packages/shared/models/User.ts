import EntityWithRoles from "./EntityWithRoles"
import { USER_ROLES } from "../constants"

import firebase from "firebase/app"
import "firebase/firestore"
import { atTimeFields, fetchRef } from "../api/helpers"
import { callApi } from "../helpers"
import Image from "./Image"
// user = id => firebase.firestore().doc(`users/${id}`)
// users = () => firebase.firestore().collection('users')

class User extends EntityWithRoles {
  static collectionPath() {
    return "users"
  }
  collectionPath() {
    return "users"
  }

  constructor(props) {
    super(props)
    Object.assign(this, props)

    if (props) {
      if (props.birthday?.toDate) {
        this.birthday = props.birthday.toDate()
      }

      if (props.avatar) {
        this.avatar = new Image(props.avatar)
      }
    }
  }

  // hasRole (role) {
  //   return this.hasRoles(role)
  // }

  hasRoles(roles) {
    // const adminModeForced = true// localStorage.getItem('adminModeForced')
    // if (adminModeForced) {
    //   super.roles = [USER_ROLES.ADMIN]
    // }
    roles.push(USER_ROLES.SUPER_ADMIN)
    return super.hasRoles(roles)
  }

  isSuperAdmin() {
    return this.hasRole(USER_ROLES.SUPER_ADMIN)
  }

  addRole({ challengeId, organisationId, role }) {
    return callApi("apiUsersAddRole", {
      userId: this.id,
      challengeId,
      organisationId,
      role,
    })
  }

  delete() {
    return firebase.firestore().doc(`users/${this.id}`).delete()
  }

  static doSendEmailVerification(url) {
    return firebase.auth().currentUser.sendEmailVerification({ url })
  }

  update({ data }) {
    return firebase
      .firestore()
      .doc(`users/${this.id}`)
      .set(
        {
          ...data,
          ...atTimeFields(),
        },
        { merge: true }
      )
  }

  static fetch({ id }, { listener }) {
    const ref = firebase.firestore().doc(`users/${id}`)
    return fetchRef(ref, {
      listener,
      initializer: (data) => new User(data),
    })
  }

  static async create(params) {
    return callApi("apiUsersCreate", params).then((result) => {
      return result
    })
  }
}

export default User
