import moment from "moment"
import { App } from "@capacitor/app"
import { Device } from "@capacitor/device"
import { createContext, useContext, useEffect, useState } from "react"

moment.locale("fr")

const DeviceContextProvider = (props) => {
  const [platform, setPlatform] = useState<any>(null)
  const [appVersion, setAppVersion] = useState<any>(null)
  const [deviceInfo, setInfo] = useState<any>(null)
  const [appBuild, setAppBuild] = useState<any>(null)
  const [appOrganisationId, setAppOrganisationId] = useState<any>(null)
  const [appId, setAppId] = useState<any>(null)
  const [deviceId, setDeviceId] = useState<any>(null)
  const [loading, setLoading] = useState<any>(true)

  useEffect(() => {
    loadInfo()
  }, [])

  const loadInfo = async () => {
    const deviceInfo = await Device.getInfo()
    const currentPlatform = deviceInfo.platform
    setPlatform(currentPlatform)
    setInfo(deviceInfo)

    const uuid = await Device.getId()
    setDeviceId(deviceInfo.isVirtual ? "VIRTUAL" : uuid + "_" + deviceInfo.platform)

    if (currentPlatform !== "web") {
      const appInfo = await App.getInfo()
      setAppVersion(appInfo.version)
      setAppBuild(appInfo.build)
      setAppId(appInfo.id)
      const nativeOrganisation = process.env.REACT_APP_FORCE_ORGA || getOrgaIdFromBundleName(appInfo.id)
      if (nativeOrganisation) {
        localStorage.setItem("organisationId", nativeOrganisation)
        setAppOrganisationId(nativeOrganisation)
      }
    }

    setLoading(false)
  }

  const getOrgaIdFromBundleName = (bundleName) => {
    switch (bundleName) {
      case "ac.maracuja.crosna":
        return "cros-na"
      default:
        return null
    }
  }
  // const loadPublicIp = async () => {
  //   const ip = await PublicIp.v4()
  //   setPublicIp(ip)
  // }

  return (
    <DeviceContext.Provider
      value={{
        getOrgaIdFromBundleName,
        // publicIp,
        platform,
        appVersion,
        appBuild,
        appOrganisationId,
        deviceId,
        appId,
        info: deviceInfo,
      }}
    >
      {!loading && props.children}
    </DeviceContext.Provider>
  )
}

const DeviceContext = createContext<any>(undefined)

const useDevice = () => useContext(DeviceContext)

export { useDevice, DeviceContextProvider }
