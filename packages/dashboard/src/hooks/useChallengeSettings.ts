import { ChallengeSettings } from "@maracuja/shared/models"
import { useEffect, useState } from 'react'

export default ({ challengeId, id = 'general' }) => {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    if (challengeId) {
      const unsubscribe = onLoadSettings()
      return () => {
        return unsubscribe()
      }
    }
  }, [challengeId])

  const onLoadSettings = () => {
    return ChallengeSettings.fetch({ challengeId: challengeId, id }, {
      listener: object => {
        setSettings(object)
      }
    })
  }

  return settings
}
