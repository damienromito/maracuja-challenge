import { Challenge } from "@maracuja/shared/models"
import { useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"
import { ROUTES } from "../../constants"
import { useApp, useCurrentChallenge } from "../../contexts"

export default () => {
  const { setLoading } = useApp()
  const { currentChallenge, setCurrentChallengeById } = useCurrentChallenge()
  const { challengeCode } = useParams<any>()
  const history = useHistory()

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    setLoading(true)
    const code = challengeCode.toUpperCase().trim()
    if (currentChallenge?.code !== code) {
      const challenge = await Challenge.fetchByCode({ challengeCode: code })
      if (challenge) {
        setCurrentChallengeById(challenge.id)
      } else {
        alert("Ce challenge n'existe pas !")
      }
    }
    setLoading(false)
    history.push(ROUTES.HOME)
  }

  return null
}
