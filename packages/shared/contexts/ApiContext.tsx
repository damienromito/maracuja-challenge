import "firebase/analytics"
import "firebase/auth"
import "firebase/firestore"
import "firebase/functions"
import "firebase/storage"
import React, { useContext, useEffect, useState } from "react"
import { firebaseApp } from "../helpers"

class Api {
  constructor() {
    firebaseApp()
  }
}

const ApiContext = React.createContext<any>(null)

const ApiContextProvider = (props) => {
  const [api, setApi] = useState<any>(null)
  useEffect(() => {
    const api = new Api()
    setApi(api)
  }, [])

  return api && <ApiContext.Provider value={api}>{props.children}</ApiContext.Provider>
}

const useApi = () => useContext(ApiContext)

export { useApi, ApiContextProvider }
