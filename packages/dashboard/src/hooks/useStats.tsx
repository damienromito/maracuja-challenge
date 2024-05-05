import { ChallengeSettings } from "@maracuja/shared/models"
import { useEffect, useState } from "react"

export default ({ challengeId }) => {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    if (challengeId) {
      const unsubscribe = onLoadStats()
      return () => {
        return unsubscribe()
      }
    }
  }, [challengeId])

  const onLoadStats = () => {
    return ChallengeSettings.fetch(
      { challengeId, id: "stats" },
      {
        listener: (stats) => {
          setStats(stats)
        },
      }
    )
  }

  return stats
}
