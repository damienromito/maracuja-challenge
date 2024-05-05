import { useHistory } from "react-router-dom"
import { Button, Modal, Text2, Title3 } from "../../components"
import ROUTES from "../../constants/routes"
import { useApp, useCurrentChallenge, useDevice } from "../../contexts"
import { openShareSheet } from "../../utils/sharing"

export default ({ isOpen, setIsOpen }) => {
  const { logEvent, setLoading } = useApp()
  const { platform } = useDevice()
  const { currentChallenge } = useCurrentChallenge()
  const history = useHistory()

  const handleClickEnterCode = () => {
    history.push(ROUTES.SIGN_UP_REFERRAL)
  }

  const handleClickAskCode = async () => {
    try {
      setLoading(true)

      await openShareSheet({
        dialogTitle: currentChallenge.referral?.sharing?.title,
        title: `Peux-tu me parrainer pour le challenge ${currentChallenge.name} ? `,
        text: `Hello ! J’aimerais participer au challenge "${currentChallenge.name}" 🤗, peux-tu m’envoyer un code de parrainage ? 🙏. Il te suffit de cliquer sur le bouton "Invite un joueur" dans la page club`,
        url: currentChallenge.dynamicLink?.link,
        platform,
      })
      logEvent("share_referee_opened")
    } catch (error) {
      logEvent("share_referee_fail")
    }
    setLoading(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} closeButton>
      <Title3>Tu n’es pas licencié du club et souhaite participer au challenge ?</Title3>

      <Text2>Un licencié t’a envoyé un code de parrainage ? Rejoins son club</Text2>
      <Button onClick={handleClickEnterCode}>ENTRER UN CODE DE PARRAINAGE</Button>
      <br />
      <Text2>Personne ne t’a envoyé de code de parrainage ? </Text2>
      <Button onClick={handleClickAskCode}>Demander un code à un ami du club</Button>
    </Modal>
  )
}
