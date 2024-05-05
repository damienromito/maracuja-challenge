import { Challenge } from "@maracuja/shared/models"
import { useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"
import { ROUTES } from "../../constants"
import { useApi, useApp, useCurrentChallenge } from "../../contexts"

export default (props) => {
  const { setLoading } = useApp()
  const api = useApi()
  const { currentChallenge, setCurrentChallengeById } = useCurrentChallenge()
  const { challengeId } = useParams<any>()
  const history = useHistory()

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    setLoading(true)
    if (currentChallenge?.id !== challengeId) {
      console.log("challengeId:", challengeId)
      const challenge = await Challenge.fetch({ id: challengeId })
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
