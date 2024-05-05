const admin = require("firebase-admin")
const { debug } = require("firebase-functions/lib/logger")
const { errorResponse } = require("./response")
const functions = require("firebase-functions")
const { ERROR_CODES } = require("../constants")

const firestoreTimestampFromData = (data) => {
  const timetampFromData = utimestampFromData(data)
  return admin.firestore.Timestamp.fromMillis(timetampFromData)
}

const utimestampFromData = (date) => {
  // return unix timestamp
  return (date.seconds ? date.seconds : date._seconds || date) * 1000
}

const atTimeFields = (isNew = false) => {
  const timestampNow = admin.firestore.Timestamp.now()
  const data = { editedAt: timestampNow }
  if (isNew) {
    data.createdAt = timestampNow
  }
  return data
}

const objectHasRoles = (object, roles) => {
  return object.roles && roles.some((role) => object.roles.includes(role))
}

const objectFromSnap = (snap) => {
  return {
    id: snap.id,
    ...snap.data(),
  }
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const objectsFromSnap = (snaps) => {
  return snaps.docs.map((snap) => {
    return {
      id: snap.id,
      ...snap.data(),
    }
  })
}

const currentDate = (params) => {
  if (params) {
    return new Date(params)
  }
  // return new Date(Date.now() + (1000 * 3600 * 24))
  return new Date()
}

const stringToId = (string, stringLength) => {
  if (stringLength) {
    string = string.substr(0, stringLength)
  }
  return string
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase()
    .normalize("NFD")
}

const generateId = (string) => {
  return string
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase()
    .normalize("NFD")
}

const trimAndLowerCase = (string) => {
  return string.trim().toLowerCase()
}

const promiseBatchByChunks = (elems, promise, chunkSize) => {
  const chunks = Array.from({ length: Math.ceil(elems.length / chunkSize) }, (v, i) => {
    return elems.slice(i * chunkSize, i * chunkSize + chunkSize)
  })
  const promises = []
  chunks.forEach((chunk, index) => {
    const chunkRequest = promise(chunk, index)
    promises.push(chunkRequest)
  })
  return promises
}

const objectSubset = (input, keys) => {
  const result = keys.reduce((acc, cur) => {
    if (input[cur] != null) {
      acc[cur] = input[cur]
    }
    return acc
  }, {})
  return result
}

const objectListSubset = (list, keys) => {
  const result = list.map((input) => {
    return objectSubset(input, keys)
  })
  return result
}

const templateFromData = (content, variables) => {
  if (!variables) return content
  return content.replace(/\{\{(.*?)\}\}/g, (i, match) => (variables[match] ? variables[match] : ""))
}

const getAction = (change) => {
  const oldDocument = change.before.exists ? change.before.data() : null
  const newDocument = change.after.exists ? change.after.data() : null

  const action = oldDocument === null ? "create" : newDocument === null ? "delete" : "update"

  return [action, oldDocument, newDocument]
}

// const isPropDirty = (prop, oldDocument, newDocument) => {
//   if (oldDocument === null && newDocument === null) {
//     // Both null -> NOT dirty
//     return false
//   }
//   if (oldDocument === null || newDocument === null) {
//     // One of them null -> dirty
//     return true
//   }
//   if (JSON.stringify(oldDocument[prop]) !== JSON.stringify(newDocument[prop])) {
//     return true
//   }
//   return false
// }

const isPropDirty = (prop, oldDocument, newDocument) => {
  if (oldDocument === null && newDocument === null) {
    // Both null -> NOT dirty
    return false
  }
  if (oldDocument === null || newDocument === null) {
    // One of them null -> dirty
    return true
  }

  const oldPropValue = getPropValue(oldDocument, prop)
  const newPropValue = getPropValue(newDocument, prop)
  if (JSON.stringify(oldPropValue) !== JSON.stringify(newPropValue)) {
    return true
  }
  return false
}

function getPropValue(object, keys) {
  keys = Array.isArray(keys) ? keys : keys.split(".")
  object = object[keys[0]]
  if (object && keys.length > 1) {
    return getPropValue(object, keys.slice(1))
  }
  return object === undefined ? null : object
}

// Update a document from an object selecting fields (null fields are exclude)
const updateFromChangeProps = async (ref, change, props, prefix = "") => {
  const newObject = objectFromChangeProps({
    change,
    props,
    prefix,
    forFireBaseUpdate: true,
  })
  if (!Object.keys(newObject).length) return false
  try {
    await ref.update(newObject)
  } catch (err) {
    return Promise.reject(err)
  }
  return newObject
}

const isPropsDirty = (change, props) => {
  const [action, oldDocument, newDocument] = getAction(change)
  let isDirty = false
  for (const prop of props) {
    if (isPropDirty(prop, oldDocument, newDocument)) {
      isDirty = true
      break
    }
  }
  return isDirty
}

const objectFromChangeProps = ({ change, props, prefix = "", forFireBaseUpdate = false }) => {
  const FieldValue = admin.firestore.FieldValue
  const [action, oldDocument, newDocument] = getAction(change)
  const newObject = {}
  props.forEach((prop) => {
    if (isPropDirty(prop, oldDocument, newDocument)) {
      const path = `${prefix ? prefix + "." : ""}${prop}`
      if (newDocument[prop]) {
        newObject[path] = newDocument[prop]
      } else if (oldDocument && oldDocument[prop]) {
        if (forFireBaseUpdate) {
          newObject[path] = FieldValue.delete()
        } else {
          newObject[path] = null
        }
      }
    }
  })
  // debug("object change newDocument=>", newDocument)
  // debug("object change newObject=>", newObject)
  return newObject
}

const getIdFromString = (string, limit) => {
  if (limit) {
    string = string.substr(0, limit)
  }
  return string.toLowerCase().replace(/[^a-zA-Z0-9]/g, "")
}

const adminEndpoint = ({ isAuth }, resolve) => {
  const ADMIN_TOKEN = "aHR0cHM6Ly9jaGFsbGVuZ2UubWFyYWN1amEuYWMvfFNULTE1ODA5NDAtYzZENk83aHlCWHdoLVY3MGl1UmdaaDBtN2xvLXNzb19mZmVfcHJvZHwxNjI4MDkyMDc0"
  return functions.region("europe-west1").https.onRequest(async (req, res) => {
    if (isAuth && req.headers.authorization !== `Bearer ${ADMIN_TOKEN}`) {
      return res.send({
        error: ERROR_CODES.NOT_AUTHORIZED,
        message: "pas authorisé",
      })
    }
    return await resolve({ data: req.body.data, res })
  })
}

const sortedDatedObjects = (objects, hook, sortBy = "startDate") => {
  const arrayOfFieldsToChange = ["startDate", "endDate"]
  const sortedQuestionSets = []
  Object.keys(objects).forEach((key) => {
    const item = objects[key]
    if (item.authorizedTeams && item.authorizedTeams.length) return
    arrayOfFieldsToChange.forEach((element) => {
      if (item[element] && item[element].toDate) {
        item[element] = item[element]?.toDate()
      }
    })
    let newItem = {
      ...item,
      id: key,
    }
    if (hook) {
      newItem = hook(newItem)
    }
    if (newItem) sortedQuestionSets.push(newItem)
  })
  return sortedQuestionSets.sort((a, b) => a[sortBy] - b[sortBy])
}

module.exports = {
  adminEndpoint,
  atTimeFields,
  capitalize,
  currentDate,
  firestoreTimestampFromData,
  generateId,
  getAction,
  getIdFromString,
  isPropDirty,
  isPropsDirty,
  objectFromChangeProps,
  objectFromSnap,
  objectHasRoles,
  objectListSubset,
  objectSubset,
  objectsFromSnap,
  promiseBatchByChunks,
  sortedDatedObjects,
  stringToId,
  templateFromData,
  trimAndLowerCase,
  updateFromChangeProps,
  utimestampFromData,
}
