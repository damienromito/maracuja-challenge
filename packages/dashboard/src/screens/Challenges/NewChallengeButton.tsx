// import M from 'materialize-css'
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { Button } from "antd"
import M from "materialize-css"
import { useState } from "react"
import Modal from "react-materialize/lib/Modal"
import { useHistory } from "react-router"
import ChallengeForm from "./ChallengeForm"

export default () => {
  const [isModalOpen, setIsModalOpen] = useState<any>(false)
  const history = useHistory()
  const { setCurrentChallengeById } = useCurrentChallenge()
  const handleChallengeSaved = (challengeId) => {
    setIsModalOpen(false)
    setCurrentChallengeById(challengeId)
    history.push(`/challenges/${challengeId}/configuration`)
    M.toast({ html: "Challenge crée !" })
  }

  const onCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <Modal
      options={{
        onOpenEnd: () => {
          setIsModalOpen(true)
        },
        onCloseEnd: onCloseModal,
      }}
      open={isModalOpen}
      header="Nouveau Challenge"
      trigger={<Button type="primary">Ajouter un challenge</Button>}
    >
      <ChallengeForm onChallengeSaved={handleChallengeSaved} />
    </Modal>
  )
}
