import { useEffect, useState } from "react"
import { useCurrentChallenge, useDevice } from "../contexts"
// https://capacitorjs.com/docs/apis/device#getinfo

export default () => {
  const { currentChallenge } = useCurrentChallenge()
  const { platform, appBuild } = useDevice()
  const [needAppUpdate, setNeedAppUpdate] = useState<any>(false)

  useEffect(() => {
    if (currentChallenge?.requiredAppBuild && appBuild && platform) {
      checkForUpdate()
    }
  }, [currentChallenge, appBuild, platform])

  const checkForUpdate = async () => {
    const requiredBuildNumber = currentChallenge.requiredAppBuild[platform]
    if (requiredBuildNumber && Number(requiredBuildNumber) > Number(appBuild)) {
      setNeedAppUpdate(true)
    }
  }

  return { needAppUpdate }
}
