import firebase from "firebase/app"
import { testConfig, prodConfig } from "./firebaseConfig"
import moment from "moment"
import "moment/locale/fr"

const firebaseApp = () => {
  if (!firebase.apps.length) {
    let firebaseConfig
    if (process.env.REACT_APP_ENV === "production" || process.env.REACT_APP_ENV === "staging") {
      firebaseConfig = prodConfig
    } else {
      firebaseConfig = testConfig
    }

    firebase.initializeApp(firebaseConfig)
    if (process.env.REACT_APP_FIRESTORE_EMULATOR === "true") {
      if (process.env.REACT_APP_TEST === "true") {
        firebase.firestore().settings({ experimentalForceLongPolling: true })
      }
      // firebase.storage().useEmulator('localhost', 9199)
      firebase.firestore().useEmulator("localhost", 8081)
      firebase.auth().useEmulator("http://localhost:9099")

      firebaseFunctions()?.useEmulator("localhost", 5001)
    }
    if (process.env.REACT_APP_FUNCTIONS_EMULATOR === "true") {
      firebaseFunctions()?.useEmulator("localhost", 5001)
      // this.functions.useFunctionsEmulator('http://192.168.0.11:5000') //UNCOMMENT TO TESTWITH CLOUD FUNCTION LOCAL EMULATOR
    }
    firebase.auth().useDeviceLanguage()

    console.log("***process.env:", process.env)
  } else {
    return firebase.app()
  }
}

const firebaseFunctions = () => {
  return firebaseApp()?.functions("europe-west1")
}

const splitValueByComma = (values: any, key: string) => {
  if (values[key]) {
    values[key] = values[key].split(",")
  }
  return values
}

function capitalizeFirstLetter(string: string) {
  return string?.charAt(0)?.toUpperCase() + string?.slice(1)
}

const callApi = async (endpoint: string, data: any) => {
  console.log("[API]", endpoint, data)
  return firebaseFunctions()
    ?.httpsCallable(endpoint)(data)
    .then((result: any) => {
      // if (result.data?.error) {
      //   return Promise.reject(result.data.error)
      // } else {
      return result.data
      // }
    })
    .catch((err) => {
      console.log("[API ERROR]", err)
      alert(
        "Une erreur est survenue, ressayez ou contactez notre équipe technique à bonjour@maracuja.ac. Merci de nous transmettre le message : " +
          err.message
      )
      return Promise.reject(err)
    })
}

const objectSubset = (input: any, keys: any, datesToIso = false) => {
  const result = keys.reduce((acc: any, cur: any) => {
    if (input[cur]) {
      if (datesToIso && input[cur] instanceof Date) {
        acc[cur] = input[cur].toISOString()
      } else {
        acc[cur] = input[cur]
      }
    }
    return acc
  }, {})
  return result
}

const objectSubsetWithDefault = (input: any, defaultObject: any, datesToIso = false) => {
  const result = Object.keys(defaultObject).reduce((acc: any, propKey) => {
    const defaultValue = defaultObject[propKey]
    if (input?.[propKey]) {
      if (datesToIso && input[propKey] instanceof Date) {
        acc[propKey] = input[propKey].toISOString()
      } else {
        acc[propKey] = input[propKey]
      }
    } else if (defaultValue !== null) {
      acc[propKey] = defaultValue
    }
    return acc
  }, {})
  return result
}

const getPeriodString = (item: any) => {
  let periodString
  if (moment(item.startDate).format("L") === moment(item.endDate).format("L")) {
    periodString = moment(item.startDate).format("dddd D MMMM H:mm")
    periodString += " - " + moment(item.endDate).format("H:mm")
  } else {
    periodString = moment(item.startDate).format("dddd D MMMM H:mm")
    periodString += " - " + moment(item.endDate).format("dddd D MMMM H:mm")
  }
  return periodString
}

const getExtensionFromMIMEType = (mimeType: string) => {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg"
    case "image/gif":
      return "gif"
    case "image/image/webp":
      return "image/webp"
    case "image/png":
      return "png"
    default:
      return null
  }
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const promiseBatchByChunks = (elems: any, promise: any, chunkSize: number) => {
  const chunks = Array.from({ length: Math.ceil(elems.length / chunkSize) }, (v, i) => {
    return elems.slice(i * chunkSize, i * chunkSize + chunkSize)
  })
  const promises: any = []
  chunks.forEach((chunk, index) => {
    const chunkRequest = promise(chunk, index)
    promises.push(chunkRequest)
  })

  return promises
}

const currentDate = (params?: any) => {
  if (params) {
    return new Date(params)
  }
  // return new Date(Date.now() + (1000 * 3600 * 24))
  return new Date()
}

const mapToArray = (data: any, { sortedByProp = null, initializer = null }: any = {}) => {
  if (!data) return null
  data = Object.keys(data).map((key) => {
    const object = data[key]
    object.id = key
    return initializer ? initializer(data[key]) : data[key]
  })
  if (sortedByProp) {
    data.sort((a: any, b: any) => (a[sortedByProp] > b[sortedByProp] ? 1 : -1))
  }
  return data
}

export {
  callApi,
  capitalizeFirstLetter,
  currentDate,
  firebaseApp,
  firebaseFunctions,
  getExtensionFromMIMEType,
  getRandomInt,
  getPeriodString,
  objectSubset,
  objectSubsetWithDefault,
  promiseBatchByChunks,
  splitValueByComma,
  mapToArray,
}
