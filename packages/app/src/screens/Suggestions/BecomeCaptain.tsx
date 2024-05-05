import { Button, Title3, Text3, Text2 } from "@maracuja/shared/components"
import { useApp, useCurrentChallenge } from "../../contexts"
import captainImage from "../../images/captain.svg"
import SuggestionContainer from "./SuggestionContainer"
import { useState } from "react"

export default ({ onSuggestionHidden }) => {
  const { currentChallenge, currentPlayer } = useCurrentChallenge()
  const { openAlert, setLoading } = useApp()
  const [applicationSubmitted, setApplicationSubmitted] = useState(false)

  const becomeCaptain = async () => {
    setLoading(true)
    const response = await currentPlayer.becomeCaptain()
    setLoading(false)
    if (response.isCaptain) {
      openAlert({
        title: "Félicitations, tu as été désigné.e " + currentChallenge.wording.captain + " ! 💪",
        message:
          "Tes coéquipiers te reconnaitront par ton brassard dans la liste des joueurs. Tu vas recevoir un email t'expliquant tes pouvoirs et ta mission 📩 ",
        buttons: ["Annuler", { text: "OK" }],
      })
    }
    setApplicationSubmitted(true)
  }

  const handleBecomeCaptain = () => {
    openAlert({
      title: "Tu vas pouvoir être désigné.e " + currentChallenge.wording.captain,
      buttons: ["Annuler", { text: "OK", handler: becomeCaptain }],
    })
    //
    // onSuggestionHidden('emailTips')
  }

  if (applicationSubmitted) {
    return <Text2> Merci pour ta candidature ! </Text2>
  } else {
    return (
      <SuggestionContainer
        title={`Ton équipe a besoin d'un.e ${currentChallenge.wording?.captain} !`}
        infoContent={
          <>
            <Text2 style={{ textAlign: "left", marginTop: 12 }}>
              En tant que {currentChallenge.wording.captain}, tu auras des pouvoirs supplémentaires pour motiver ton
              équipe et pousser tes coéquipiers à progresser !
            </Text2>
          </>
        }
        iconContent={<img style={{ flex: 1, marginRight: "auto", marginLeft: "auto" }} src={captainImage} />}
        buttonContent={
          <Button onClick={handleBecomeCaptain}>DEVENIR {currentChallenge.wording?.captain} D'ÉQUIPE</Button>
        }
      />
    )
  }
}
