import firebase from "firebase/app"
import { fetchListRef, fetchRef } from "../api/helpers"
import { callApi } from "../helpers"
import Activity from "./Activity"

class ExternalActivity extends Activity {
  static collectionPath({ challengeId }) {
    return `challenges/${challengeId}/externalActivities`
  }
  collectionPath() {
    return `challenges/${this.challengeId}/externalActivities`
  }

  static getDefaultValues() {
    return {
      spreadsheetUrl: "",
      image: "",
      preview: "",
    }
  }

  async initializePlayerList() {
    return await callApi("apiExternalActivitiesInitializePlayerList", {
      challengeId: this.challengeId,
      externalActivityId: this.id,
    })
  }

  async importScores() {
    return await callApi("apiExternalActivitiesImportScores", {
      challengeId: this.challengeId,
      externalActivityId: this.id,
    })
  }

  static fetchAll({ challengeId }) {
    const db = firebase.firestore()
    const ref = db.doc(`challenges/${challengeId}/externalActivities`)
    return fetchListRef(ref)
  }

  // static create ({ challengeId }) {
  //   const db = firebase.firestore()
  //   const ref = db.doc(`challenges/${challengeId}/externalActivities`)
  //   return fetchListRef(ref)
  // }
}

export default ExternalActivity
