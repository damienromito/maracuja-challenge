import { Deploy } from "cordova-plugin-ionic"
import { useEffect, useState } from "react"
import { useCurrentChallenge } from "../contexts"

const useAppFlow = () => {
  const { currentChallenge } = useCurrentChallenge()
  const [availableUpdateBuildNumber, setAvailableUpdateBuildNumber] = useState<any>(null)
  const [isUpdatingApp, setIsUpdatingApp] = useState<any>(false)

  useEffect(() => {
    if (!availableUpdateBuildNumber) {
      console.log("availableUpdateBuildNumber:", availableUpdateBuildNumber)
      checkForUpdateAvailable()
    }
  }, [currentChallenge])

  useEffect(() => {
    if (availableUpdateBuildNumber && currentChallenge?.requiredAppBuild && !isUpdatingApp) {
      console.log("isUpdatingApp:", isUpdatingApp)
      checkForUpdate()
    }
  }, [availableUpdateBuildNumber, currentChallenge])

  const checkForUpdateAvailable = async () => {
    const update = await Deploy.checkForUpdate()
    console.log("update:", update)
    if (update.available) {
      setAvailableUpdateBuildNumber(update.build)
    }
  }

  const checkForUpdate = async () => {
    setIsUpdatingApp(true)
    const requiredBuildNumber = Number(currentChallenge.requiredAppBuild.appFlow)
    console.log("requiredBuildNumber:", requiredBuildNumber)
    if (requiredBuildNumber === availableUpdateBuildNumber) {
      await syncUpdate()
    }
    setIsUpdatingApp(false)
  }

  const syncUpdate = async () => {
    console.log("async:")
    await Deploy.sync({ updateMethod: "auto" }, (percentDone) => {
      console.log(`Update is ${percentDone}% done!`)
    })
    setAvailableUpdateBuildNumber(null)
  }

  return { isUpdatingApp }
}

export default useAppFlow
