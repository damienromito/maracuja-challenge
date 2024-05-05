const functions = require("firebase-functions").region("europe-west1")
const admin = require("firebase-admin")
const { generateId, trimAndLowerCase, objectSubset, stringToId } = require("../../utils")
const { debug, info, error, warn } = require("firebase-functions/lib/logger")
const db = admin.firestore()
const { promiseBatchByChunks } = require("../../utils")

const { loadFileRows, syncSheetFromUrl } = require("../../utils/gSheet")
const { successResponse, errorResponse } = require("../../utils/response")
const FirebaseObject = require("../../models/FirebaseObject")
Array.prototype.forEachAsyncParallel = async function (fn) {
  await Promise.all(this.map(fn))
}
const timestamp = admin.firestore.Timestamp
const fieldValue = admin.firestore.FieldValue

exports = module.exports = functions.https.onCall(async (data, context) => {
  const { spreadSheetUrl, propertiesAndKeysToImport, fieldsToImport, createClubIfNotExist, createPropertyValueIfNotExist, fieldsToBuildId, importDepartmentAndRegionFromZipCode } = data

  if (importDepartmentAndRegionFromZipCode) {
    if (!propertiesAndKeysToImport.department || !propertiesAndKeysToImport.region || !fieldsToImport.includes("zipCode")) {
      return errorResponse("Si importDepartmentAndRegionFromZipCode = true, parametres obligatoires : zipCode, department et region")
    }
  }
  const properties = await loadClubProperties({ propertiesAndKeysToImport, importDepartmentAndRegionFromZipCode })
  const sheet = await syncSheetFromUrl(spreadSheetUrl)
  const rows = await sheet.getRows()

  const clubs = rows.map((line) => {
    const club = buildClubFromClubProperties({ line, properties, importDepartmentAndRegionFromZipCode })
    fieldsToImport.forEach((field) => {
      if (line[field]) {
        club[field] = line[field].trim()
      }
    })
    return club
  })

  if (createPropertyValueIfNotExist) {
    await createNewPropertiesValues({ propertiesAndKeysToImport })
  }

  const successCount = await importClubs({ clubs, createClubIfNotExist, fieldsToBuildId })
  const message = `${successCount} clubs updated`
  debug(message)
  return successResponse({ message })
})

const buildClubFromClubProperties = ({ line, properties, createPropertyValueIfNotExist = false, importDepartmentAndRegionFromZipCode }) => {
  let club = {}
  if (importDepartmentAndRegionFromZipCode) {
    club = getGeoFromZipCode({ zipCode: line.zipCode, regions: properties.region.values, departments: properties.department.values })
  }

  for (const propertyId of Object.keys(properties)) {
    if (importDepartmentAndRegionFromZipCode && (propertyId === "region" || propertyId === "department")) {
      continue
    }
    const lineProperty = line[propertyId]
    if (!lineProperty || lineProperty === "") continue

    const propertyValues = properties[propertyId].values
    let propertyValue = propertyValues.find((value) => {
      const lineValue = trimAndLowerCase(lineProperty)
      return trimAndLowerCase(value.id) === lineValue || trimAndLowerCase(value.name) === lineValue
    })
    if (createPropertyValueIfNotExist && !propertyValue) {
      properties[propertyId].needUpdate = true
      propertyValue = {
        id: generateId(lineProperty),
        name: lineProperty,
      }
      properties[propertyId].values.push(propertyValue)
    }
    club[propertyId] = propertyValue
  }
  return club
}

const loadClubProperties = async ({ propertiesAndKeysToImport, importDepartmentAndRegionFromZipCode }) => {
  if (Object.keys(propertiesAndKeysToImport)?.length) {
    const clubPropertyRef = (id) => db.collection("clubProperties").doc(id)
    const properties = {}
    await Object.keys(propertiesAndKeysToImport).forEachAsyncParallel(async (propertyId) => {
      const propertyKeysToImport = propertiesAndKeysToImport[propertyId]
      const propertySnap = await clubPropertyRef(propertyId).get()
      const property = FirebaseObject.parseSnap(propertySnap)
      if (!(importDepartmentAndRegionFromZipCode && (propertyId === "region" || propertyId === "department"))) {
        property.values = property.values.map((value) => objectSubset(value, propertyKeysToImport))
      }
      properties[propertyId] = property
    })
    return properties
  } else {
    return null
  }
}

const createNewPropertiesValues = async ({ propertiesAndKeysToImport }) => {
  const batch = db.batch()

  for (const propertyId of propertiesAndKeysToImport) {
    const property = properties[propertyId]
    if (property.needUpdate) {
      const newClubProperty = { values: property.values }
      newClubProperty.editedAt = timestamp.now()
      batch.update(clubPropertyRef(propertyId), newClubProperty)
    }
  }
  return batch.commit()
}

const importClubs = async ({ clubs, createClubIfNotExist, fieldsToBuildId }) => {
  const clubRef = (id) => db.collection("clubs").doc(id)

  const chunkSize = 2
  const promises = promiseBatchByChunks(
    clubs,
    (chunk) => {
      const batch = db.batch()
      chunk.forEach((club) => {
        const clubId = club.id || getIdFromClub(objectSubset(club, fieldsToBuildId || ["name", "zipCode"]))
        // cleanOldClub(club)
        delete club.id
        club.editedAt = timestamp.now()
        if (createClubIfNotExist) {
          club.createdAt = timestamp.now()
          batch.set(clubRef(clubId), club, { merge: true })
        } else {
          debug(clubId + "wil be updated")
          batch.update(clubRef(clubId), club)
        }
      })
      // Update clubs
      return batch.commit()
    },
    chunkSize
  )

  const chunkResults = await Promise.all(promises)

  const successCount = chunkResults.reduce((total, result) => total + chunkSize, 0)

  return successCount
}

const cleanOldClub = (club) => {
  club.userIds = fieldValue.delete()
  club.originId = fieldValue.delete()
  club.regionId = fieldValue.delete()
  club.tribeId = fieldValue.delete()
  club.tribeType = fieldValue.delete()
  club.tribeTypeId = fieldValue.delete()
  club.tribeIds = fieldValue.delete()
  // club.memberCount =  fieldValue.delete()
}

const getIdFromClub = (fields) => {
  // { name, zipCode, tribe, sportFederation }
  let idString = ""
  const fieldsArray = Object.keys(fields)
  fieldsArray.forEach((key, index) => {
    const fieldValue = fields[key]
    if (typeof fieldValue === "object") {
      idString += fieldValue.id
    } else {
      idString += stringToId(fieldValue)
    }
    if (index < fieldsArray.length - 1) {
      idString += "_"
    }
  })
  // const idString = `${stringToId(name)}_${zipCode || ''}_${tribe?.id || ''}${sportFederation?.id || ''}`
  return idString
}

const getGeoFromZipCode = ({ zipCode, regions, departments }) => {
  const A2 = ["20146", "20537", "20166", "20090", "20000", "20239", "20128", "20112", "20151", "20167", "20110", "20160", "20140", "20151", "20116", "20190", "20121", "20160", "20119", "20129", "20110", "20100", "20136", "20169", "20111", "20142", "20151", "20170", "20133", "20190", "20130", "20164", "20111", "20140", "20117", "20134", "20160", "20123", "20135", "20168", "20138", "20148", "20126", "20167", "20117", "20126", "20114", "20100", "20190", "20143", "20157", "3 20100", "20128", "20160", "20128", "20153", "20137", "20160", "20170", "20139", "20165", "20141", "20112", "20140", "20171", "20160", "20117", "20140", "20113", "20112", "20125", "20147", "20150", "20134", "20147", "20121"]
  const B2 = ["20144", "20243", "20118", "20270", "20244", "20212", "20224", "20270", "20220", "20251", "20212", "20272", "20270", "20220", "20276", "20225", "20253", "20228", "20200", "20226", "20252", "20620", "20235", "20290", "20222", "20212", "20228", "20224", "20214", "20260", "20244", "20229", "20270", "20290", "20252", "20230", "20217", "20235", "20229", "20244", "20237", "20215", "20224", "20250", "20270", "20213", "20212", "20235", "20218", "20236", "20225", "20238", "20221", "20230", "20240", "20256", "20224", "20250", "20226", "20237", "20290", "20212", "20244", "20275", "20253", "20212", "20234", "20225", "20237", "20212", "20600", "20245", "20218", "20240", "20227"]

  let departmentCode = zipCode.trim().substring(0, 2)
  if (A2.includes(zipCode)) {
    departmentCode = "2A"
  } else if (B2.includes(zipCode)) {
    departmentCode = "2B"
  } else if (departmentCode === "97" || departmentCode === "98") {
    departmentCode = zipCode.substring(0, 3)
  }
  const matchingDept = departments.find((dep) => dep.code === departmentCode + "")
  const matchingRegion = matchingDept && regions.find((reg) => reg.code === matchingDept.region_code)

  if (!matchingDept || !matchingRegion) return null
  const geo = {
    department: objectSubset(matchingDept, ["id", "code", "name"]),
    region: objectSubset(matchingRegion, ["id", "code", "name"]),
  }
  return geo
}
