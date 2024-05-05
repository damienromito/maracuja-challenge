import firebase from "firebase/app"
import "firebase/firestore"
import { fetchListRef } from "../api/helpers"
import { capitalizeFirstLetter } from "../helpers"
import FirebaseObject from "./FirebaseObject"

class ClubProperty extends FirebaseObject {
  static collectionPath() {
    return "clubProperties"
  }
  collectionPath() {
    return "clubProperties"
  }

  constructor(props) {
    super(props)
    Object.assign(this, props)
  }

  addValue({ name }) {
    const id = name
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase()
      .normalize("NFD")
    this.values.push({
      name: capitalizeFirstLetter(name.trim()),
      id,
    })
    this.values.sort(function (a, b) {
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0
    })
    const newProperty = {
      values: this.values,
    }
    return this.update(newProperty)
  }

  deleteValue(id) {
    const index = this.values.findIndex((val) => val.id === id)
    this.values.splice(index, 1)
    const newProperty = {
      values: this.values,
    }
    return this.update(newProperty)
  }

  static async fetchValues({ id }) {
    const property = await this.fetch({ id })
    return property.values
  }

  static fetchAll() {
    const ref = firebase.firestore().collection("clubProperties")
    return fetchListRef(ref)
  }
}

export default ClubProperty
