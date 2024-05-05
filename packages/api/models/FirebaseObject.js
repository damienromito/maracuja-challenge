const admin = require("firebase-admin")
const { promiseBatchByChunks, atTimeFields } = require("../utils")
const db = admin.firestore()

module.exports = class FirebaseObject {
  constructor(state) {
    Object.assign(this, state)
  }

  static documentRef(params) {
    return db.doc(this.collectionPath(params) + `/${params.id}`)
  }
  static collectionRef(params) {
    return db.collection(this.collectionPath(params))
  }

  documentRef() {
    return db.doc(this.collectionPath() + `/${this.id}`)
  }
  collectionRef() {
    return db.collection(this.collectionPath())
  }
  collectionGroupRef() {
    return db.collectionGroup(this.collectionKey)
  }

  // create () {
  //   return this.documentRef().set(this)
  // }

  fetch() {
    return this.documentRef()
      .get()
      .then((snap) => {
        return FirebaseObject.parseSnap(snap)
      })
  }

  delete() {
    return this.documentRef().delete()
  }

  update(data) {
    return this.documentRef().update(data)
  }

  static async create(documentParams, data, fetchObject = false) {
    data = { ...data, ...atTimeFields(true) }
    if (documentParams.challengeId) data.challengeId = documentParams.challengeId
    const ref = this.documentRef(documentParams)
    await ref.set(data)

    if (fetchObject) {
      return this.fetch(documentParams)
    } else {
      return true
    }
  }

  static fetch(documentParams) {
    const ref = this.documentRef(documentParams)
    return this.fetchRef(ref, { initializer: (data) => new this(data) })
  }

  static fetchAll(collectionParams = {}, options = { refHook: null }) {
    let ref = this.collectionRef(collectionParams)
    if (options.refHook) {
      ref = options.refHook(ref)
    }
    return this.fetchListRef(ref, {
      initializer: (data) => {
        return new this(data)
      },
    })
  }

  static async updateAll(collectionParams = {}, data, options = { refHook: null }) {
    let objects = await this.fetchAll(collectionParams, options)
    return this.updateBatch(objects, data)
  }

  static fetchAllFromAllChallenges(options = { refHook: null }) {
    let ref = this.collectionGroupRef()
    if (options.refHook) {
      ref = options.refHook(ref)
    }
    return this.fetchListRef(ref, {
      initializer: (data) => {
        return new this(data)
      },
    })
  }

  static async fetchFirst(collectionParams, options) {
    const objects = await this.fetchAll(collectionParams, options)
    if (objects?.length) {
      return objects[0]
    } else {
      return null
    }
  }

  static async update(documentParams, data, fetchObject) {
    const ref = this.documentRef(documentParams)
    await ref.update({
      ...data,
      ...atTimeFields(),
    })

    if (fetchObject) {
      return this.fetch(documentParams)
    } else {
      return true
    }
  }

  static async delete(documentParams) {
    const ref = this.documentRef(documentParams)
    return ref.delete()
  }

  /******************************* */

  static updateBatch = (objectsArray, data) => {
    return promiseBatchByChunks(
      objectsArray,
      (chunk, index) => {
        const batch = db.batch()
        chunk.forEach((o) => {
          const ref = o.documentRef()
          batch.update(ref, data)
        })
        return batch.commit()
      },
      400
    )
  }

  static fetchRef = (ref, options = { initializer: null, defaultValue: null }) => {
    return ref.get().then((snap) => {
      const object = this.parseSnap(snap) || options.defaultValue || null
      return this.initializeObject(object, options.initializer)
    })
  }

  static fetchListRef = (ref, { initializer } = {}) => {
    return ref.get().then((snap) => {
      return this.parseSnapCollection(snap, initializer)
    })
  }

  static parseSnap = (snap) => {
    if (snap.exists) {
      return this.objectFromSnap(snap)
    } else {
      return false
    }
  }

  static parseSnapCollection = (snap, initializer) => {
    if (snap.size) {
      return snap.docs.map((snap) => {
        return this.initializeObject(this.objectFromSnap(snap), initializer)
      })
    } else {
      return false
    }
  }

  static initializeObject = (object, initializer) => {
    if (initializer && object) {
      return initializer(object)
    } else {
      return object
    }
  }

  static fetchByProperty = async ({ collectionKey, collectionDocId, subCollectionKey, propertyKey, propertyValue, returnFirstElem = true, comparator = "==" }) => {
    console.log("collectionKey:", collectionKey)
    let ref = db.collection(collectionKey)
    if (subCollectionKey) {
      ref = ref.doc(collectionDocId).collection(subCollectionKey)
    }
    let snap = await ref.where(propertyKey, comparator, propertyValue).get()
    if (!snap.size) return null
    if (returnFirstElem) {
      return FirebaseObject.parseSnap(snap.docs[0])
    } else {
      return FirebaseObject.parseSnapCollection(snap)
    }
  }

  static objectFromSnap = (snap) => {
    return {
      id: snap.id,
      ...snap.data(),
    }
  }

  static objectsFromSnap = (snaps) => {
    return snaps.docs.map((snap) => {
      return {
        id: snap.id,
        ...snap.data(),
      }
    })
  }
}
