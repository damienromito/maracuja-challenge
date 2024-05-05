import { IonHeader } from "@ionic/react"
import { PLAYER_ROLES } from "@maracuja/shared/constants"
import { useState } from "react"
import { InfoBlock, SharePopup } from "."
import { useCurrentChallenge } from "../contexts"
export default ({ alternativeComponent = undefined }) => {
  const { currentChallenge, currentPlayer, currentTeam } = useCurrentChallenge()

  const [popupIsOpen, setPopupIsOpen] = useState<any>(false)

  if (
    currentChallenge.onboarding.needCaptain &&
    !currentPlayer.hasRole(PLAYER_ROLES.REFEREE) &&
    !(currentTeam.captainCount > 0)
  ) {
    return (
      <>
        <IonHeader onClick={() => setPopupIsOpen(true)} style={{ cursor: "pointer" }}>
          {/* <InfoBlock>Il manque un {currentChallenge.wording.captain} dans {currentChallenge.wording.theTribe}</InfoBlock> */}
          <InfoBlock>Finaliser l'inscription de {currentChallenge.wording.yourTribe}</InfoBlock>
        </IonHeader>
        <SharePopup isOpen={popupIsOpen} setIsOpen={setPopupIsOpen} contentType="captain" />
      </>
    )
  } else if (
    !currentPlayer.hasRole(PLAYER_ROLES.REFEREE) &&
    currentChallenge.onboarding.playerCountMinimum &&
    currentTeam.playerCount < currentChallenge.onboarding.playerCountMinimum
  ) {
    const remainingPlayers = currentChallenge.onboarding.playerCountMinimum - currentTeam.playerCount
    return (
      <>
        <IonHeader onClick={() => setPopupIsOpen(true)} style={{ cursor: "pointer" }}>
          <InfoBlock>Finaliser l'inscription de {currentChallenge.wording.yourTribe}</InfoBlock>
        </IonHeader>
        <SharePopup
          isOpen={popupIsOpen}
          setIsOpen={setPopupIsOpen}
          contentType="member"
          title={`Il te manque ${remainingPlayers} coéquipiers`}
          message={`Une équipe c'est avant tout des coéquipiers. ${currentChallenge.onboarding.playerCountMinimum} joueurs est un minimum pour faire la différence contre les autres ${currentChallenge.wording.tribes}.`}
        />
      </>
    )
  } else {
    return alternativeComponent || null
  }
}
