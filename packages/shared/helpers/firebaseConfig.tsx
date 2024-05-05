
const prodConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  appId: process.env.REACT_APP_ID,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET
}

const testConfig = {
  apiKey: process.env.REACT_APP_DEV_API_KEY,
  appId: process.env.REACT_APP_DEV_ID,
  authDomain: process.env.REACT_APP_DEV_AUTH_DOMAIN,
  measurementId: process.env.REACT_APP_DEV_MEASUREMENT_ID,
  messagingSenderId: process.env.REACT_APP_DEV_MESSAGING_SENDER_ID,
  projectId: process.env.REACT_APP_DEV_PROJECT_ID,
  storageBucket: process.env.REACT_APP_DEV_STORAGE_BUCKET
}

export {
  prodConfig,
  testConfig
}
