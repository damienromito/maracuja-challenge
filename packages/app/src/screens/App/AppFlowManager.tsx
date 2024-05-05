import React, { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { Modal, Popup, Text2 } from "../../components"
import useStatusBar from "../../hooks/useStatusBar"

const AppFlowContextProvider = ({ children }: { children: ReactNode }) => {
  const [popupInfos, setPopupInfos] = useState<any>(null)
  const [updateIsAvailable, setUpdateIsAvailable] = useState<any>(null)

  useEffect(() => {
    // Deploy.getAvailableVersions().then((versions) => {
    //   console.log("VERSIONS")
    //   console.log(versions)
    // }).catch((err) => {
    //   console.log(err)
    // })
    // Deploy.getCurrentVersion().then((versions) => {
    //   console.log("CURRENTVERSION")
    //   console.log(versions)
    // }).catch((err) => {
    //   console.log(err)
    // })
    // Deploy.getConfiguration().then((config) => {
    //   console.log("config")
    //   console.log(config)
    // }).catch((err) => {
    //   console.log(err)
    // })
  }, [])

  return (
    <AppFlowContext.Provider value={{ setUpdateIsAvailable }}>
      {children}

      {updateIsAvailable && (
        <Modal isOpen={updateIsAvailable} title="Relance ton application 🤓">
          <Text2>
            Une nouvelle mise à jour est disponible. Elle est nécessaire afin de continuer à utiliser l'application.
          </Text2>
          <Text2>Relance ton application afin que la mise à jour se fasse.</Text2>
          <br />
        </Modal>
      )}
    </AppFlowContext.Provider>
  )
}
const AppFlowContext = createContext<any>(null)

// const useAppFlow = () => useContext(AppFlowContext)

export {
  AppFlowContext,
  // useAppFlow,
  AppFlowContextProvider,
}
