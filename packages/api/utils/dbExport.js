
const admin = require('firebase-admin')
const { parseAsync } = require('json2csv')
const { v4 } = require('uuid')
const fs = require('fs')
const path = require('path')
const os = require('os')
const moment = require('moment')
const { objectsFromSnap } = require('../utils')
const db = admin.firestore()
const fieldPath = admin.firestore.FieldPath

const exportToCsv = async (data, options = { objectsHook: null }) => {
  const { challengeId, collection, role, where, limit, playerIds, linePerArrayObject, objectFields, fields } = data
  // gets the documents from the firestore collection
  let objectArray = await fetchDataToExport({ challengeId, collection, playerIds, limit, role, where })
  if (options.objectsHook) {
    objectArray = options.objectsHook(objectArray)
  }
  const csvLines = await convertObjectsToCSVLines({ objectArray, linePerArrayObject, objectFields, fields })

  const fileUrl = await buildCSVFile({ collection, challengeId, csvLines })

  return {
    url: fileUrl
  }
}

const formatDate = (line, key) => {
  if (line[key]) {
    let date = line[key]
    if (!(date instanceof Date)) {
      date = date.toDate()
    }
    line[key] = moment(date).format('DD/MM/YYYY H:mm')
  }
}

const convertObjectsToCSVLines = async ({ objectArray, linePerArrayObject, objectFields, fields }) => {
  let result = []
  if (linePerArrayObject) {
    objectArray.forEach(object => {
      const objectToSplit = object[linePerArrayObject]
      delete object[linePerArrayObject]

      const baseObject = { ...object }
      objectToSplit?.forEach(elem => {
        // console.log('object:', elem)
        const newObject = { ...baseObject, ...elem }
        result.push(newObject)
      })
    })
    // console.log('result:', result)
    fields = fields.concat(objectFields)
    // console.log('fields:', fields)
  } else {
    result = objectArray
  }

  const lines = result.map(line => {
    if (line.formated) return line
    formatDate(line, 'createdAt')
    formatDate(line, 'editedAt')
    formatDate(line, 'startedAt')
    formatDate(line, 'sentAt')
    formatDate(line, 'birthday')
    formatDate(line, 'motivatedAt')
    if (line.roles) {
      line.roles = line.roles.join(',')
    }
    line.formated = true
    return line
  })

  // csv field headers ex : [ "playerId", "team.name", "team.id"]

  let output
  // get csv output
  if (fields) {
    output = await parseAsync(lines, { fields })
  } else {
    output = lines.splice('\n')
  }
  return output
}
const buildCSVFile = ({ collection, challengeId, csvLines }) => {
  console.log('challengeId:', challengeId)
  const dayName = moment(new Date()).format('YYYY-MM-DD')
  const dateTime = new Date().toISOString().replace(/\W/g, '')

  const filename = `${collection}-${dateTime}.csv`
  console.log('filename:', filename)

  const tempLocalFile = path.join(os.tmpdir(), filename)

  return new Promise((resolve, reject) => {
    // write contents of csv into the temp file
    fs.writeFile(tempLocalFile, csvLines, error => {
      if (error) {
        reject(error)
        return
      }
      const bucket = admin.storage().bucket()
      const uuid = v4()
      // upload the file into the current firebase project default bucket
      bucket.upload(tempLocalFile, {
        // Workaround: firebase console not generating token for files
        // uploaded via Firebase Admin SDK
        // https://github.com/firebase/firebase-admin-node/issues/694
        // https://console.firebase.google.com/u/0/project/maracuja-english-challenge/storage/maracuja-english-challenge.appspot.com/files/~2Fchallenges~2F4xsaquitel_sst2303~2Fcsv~2F2022-03-24
        destination: challengeId ? `challenges/${challengeId}/csv/${dayName}/${filename}` : `csv/${filename}`,
        public: true,
        metadata: {
          metadata: {
            firebaseStorageDownloadTokens: uuid
          }
        }
      })
        .then(data => {
          const file = data[0]
          const url = resolve('https://firebasestorage.googleapis.com/v0/b/' + bucket.name + '/o/' + encodeURIComponent(file.name) + '?alt=media&token=' + uuid)
          return url
        })
        .catch(err => {
          console.log('ERRR', err)
          return reject(err)
        })
    })
  })
}

const fetchDataToExport = async ({ challengeId, collection, playerIds, limit, role, where }) => {
  let ref
  if (challengeId) {
    ref = db.collection('challenges').doc(challengeId).collection(collection)
  } else {
    ref = db.collection(collection)
    // .where('challengeIds', 'array-contains', 'ridetotokyo')
  }

  if (playerIds && playerIds.length > 0) {
    ref = ref.where(fieldPath.documentId(), 'in', playerIds)
  } else if (limit) {
    console.log('limit:', limit)
    ref = ref.limit(limit)
  } else if (where) {
    where.map(item => {
      console.log('item:', item)
      ref = ref.where(item.key, '==', item.value)
    })
  } else {
    ref = ref.orderBy('createdAt', 'asc')
  }

  if (role) {
    ref = ref.where('roles', 'array-contains', role)
  }
  const snap = await ref.get()
  console.log('snap size', snap.size)
  return objectsFromSnap(snap)
}

module.exports = {
  exportToCsv,
  fetchDataToExport,
  convertObjectsToCSVLines,
  buildCSVFile
}
