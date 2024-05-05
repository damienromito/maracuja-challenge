import { getExtensionFromMIMEType } from "../helpers"
import firebase from "firebase/app"
import "firebase/firestore"
const fetchRef = (ref: any, { listener, initializer, defaultValue }: any = {}) => {
  const parseObjectSnap = (snap: any) => {
    const object = parseSnap(snap) || defaultValue
    return initializeObject(object, initializer)
  }

  if (listener) {
    return ref.onSnapshot((snap: any) => {
      const object = parseObjectSnap(snap)
      listener(object)
      // return object
    })
  } else {
    return ref.get().then((snap: any) => {
      return parseObjectSnap(snap)
    })
  }
}

const arrayFromObjects = ({ objects, initializer }: any) => {
  const result = Object.keys(objects).map((key) => {
    let data = objects[key]
    if (initializer) data = initializer(data)
    data.id = key
    return data
  })
  return result
}

const fetchListRef = (ref: any, { initializer, listener }: any = {}) => {
  if (listener) {
    return ref.onSnapshot((snap: any) => {
      const objects = parseSnapCollection(snap, initializer)
      listener(objects)
      // return object
    })
  } else {
    return ref.get().then((snap: any) => {
      return parseSnapCollection(snap, initializer)
    })
  }
}

const initializeObject = (object: any, initializer: any) => {
  if (initializer && object) {
    return initializer(object)
  } else {
    return object
  }
}


const parseSnap = (snap: any) => {
  if (snap.exists) {
    return objectFromSnap(snap)
  } else {
    return false
  }
}

const parseSnapCollection = (snap: any, initializer: any) => {
  if (snap.size) {
    return snap.docs.map((snap: any) => {
      return initializeObject(objectFromSnap(snap), initializer)
    })
  } else {
    return false
  }
}

const objectFromSnap = (snap: any) => {
  return {
    id: snap.id,
    ...snap.data(),
  }
}

const atTimeFields = (isNew = false) => {
  const data: any = {
    editedAt: firebase.firestore.FieldValue.serverTimestamp(),
  }
  if (isNew) {
    data.createdAt = firebase.firestore.FieldValue.serverTimestamp()
  }
  return data
}

const getRankingId = (phase: any, team: any) => {
  if (!phase.rankingFilters || phase.rankingFilters.length === 0) return phase.id

  const id = phase.rankingFilters
    .map((filter: string) => {
      return team[filter]?.id
    })
    .join("-")
  return phase.id + "-" + id
}

// FIRESTORE
const storageRef = (folderPath: string, fileName: string, extension: string) =>
  firebase.storage().ref().child(`${folderPath}/${fileName}.${extension}`)

const uploadImage = async ({
  imageBlob,
  imageData,
  challengeId,
  fileName,
  folderPath = ".",
  transformationEnabled,
}: any) => {
  let file, ext, metadata: any
  if (imageBlob) {
    file = imageBlob
    ext = getExtensionFromMIMEType(imageBlob.type)
    metadata = { contentType: imageBlob.type }
  }
  if (imageData && imageData.length > 0) {
    file = imageData[0]
    ext = file.name.split(".").pop().toLowerCase()
    metadata = { contentType: file.type }
  }
  metadata.customMetadata = { fromChallengeId: challengeId }
  if (transformationEnabled) {
    metadata.customMetadata.transformationEnabled = "true"
  }
  const snapshot = await storageRef(folderPath, fileName, ext).put(file, metadata)
  return await snapshot.ref.getDownloadURL()
}

export {
  arrayFromObjects,
  fetchRef,
  fetchListRef,
  initializeObject,
  uploadImage,
  parseSnap,
  parseSnapCollection,
  objectFromSnap,
  atTimeFields,
  getRankingId,
}
