import firebase from "firebase/app"
import "firebase/firestore"
import { fetchListRef, fetchRef } from "../api/helpers"
import { atTimeFields } from "@maracuja/shared/api/helpers"

class FirebaseObject {

  id?: string

  static documentRef(params: any) {
    return firebase.firestore().doc(this.collectionPath(params) + `/${params.id}`)
  }
  static collectionRef(params: any) {
    return firebase.firestore().collection(this.collectionPath(params))
  }

  static documentPath(params: any) {
    return this.collectionPath(params) + `/${params.id}`
  }

  static collectionPath(params?: any) {
    return ""
  }

  collectionPath(params?: any) {
    return ""
  }

  documentPath() {
    return this.collectionPath() + `/${this.id}`
  }
  documentRef() {
    return firebase.firestore().doc(this.collectionPath() + `/${this.id}`)
  }
  collectionRef() {
    return firebase.firestore().collection(this.collectionPath())
  }

  constructor(state: any) {
    if (state) {
      state.createdAt = FirebaseObject.handleDateFromApi(state.createdAt)
      state.editedAt = FirebaseObject.handleDateFromApi(state.editedAt)
      Object.assign(this, state)
    }
  }

  delete() {
    return this.documentRef().delete()
  }

  update(data: any) {
    return this.documentRef().update({
      ...data,
      ...atTimeFields(),
    })
  }

  static fetch(
    documentParams: any,
    options: any = { initializer: undefined, listener: undefined, defaultValue: undefined }
  ) {
    console.log("[fetch]", this.documentPath(documentParams))
    const ref = this.documentRef(documentParams)
    return fetchRef(ref, {
      listener: options.listener,
      initializer: (data: any) => (options.initializer ? options.initializer(data) : new this(data)),
      defaultValue: options.defaultValue,
    })
  }



  static fetchAll(collectionParams: any = {}, options: any = { refHook: undefined, initializerHook: undefined, listener: undefined }) {
    console.log("[fetch all]", this.collectionPath(collectionParams))
    let ref = this.collectionRef(collectionParams)
    if (options.refHook) {
      ref = options.refHook(ref)
    }
    return fetchListRef(ref, {
      listener: options.listener,
      initializer: (data: any) => (options.initializerHook ? options.initializerHook(data) : new this(data)),
    })
  }

  static async fetchFirst({ challengeId = null, refHook = null, initializerHook = null }) {
    const objects = await this.fetchAll({ challengeId }, { refHook, initializerHook })
    if (objects?.length) {
      return objects[0]
    } else {
      return null
    }
  }

  static create(documentParams: any = { id: null, challengeId: null }, data: any) {
    const ref = this.documentRef(documentParams)
    delete data.id
    return ref.set({
      ...data,
      ...atTimeFields(true),
    })
  }

  static update(documentParams: any, data: any) {
    const ref = this.documentRef(documentParams)
    return ref.update({
      ...data,
      ...atTimeFields(),
    })
  }

  static delete(documentParams: any) {
    const ref = this.documentRef(documentParams)
    return ref.delete()
  }

  static handleDateFromApi(date: any) {
    if (!date) return null
    if (date.toDate) {
      return date.toDate()
    } else {
      return new Date(date)
    }
  }
}

export default FirebaseObject

interface FetchOptions {
  refHook?: () => void, initializerHook?: () => void, listener: () => void
}