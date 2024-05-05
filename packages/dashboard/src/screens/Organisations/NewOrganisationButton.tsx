// import M from 'materialize-css'
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import M from "materialize-css"
import React, { useState } from "react"
import Modal from "react-materialize/lib/Modal"
import { useHistory } from "react-router"
import ChallengeForm from "../Challenges/ChallengeForm"
import { Organisation } from "@maracuja/shared/models"
import { Button } from "antd"
import OrganisationForm from "./OrganisationForm"
import { useCurrentOrganisation } from "@maracuja/shared/contexts"
import { ROUTES } from "../../constants"

export default () => {
  const [isModalOpen, setIsModalOpen] = useState<any>(false)
  const history = useHistory()
  const { setCurrentChallengeById } = useCurrentChallenge()
  const { setCurrentOrganisationById } = useCurrentOrganisation()
  const handleOrganisationCreated = (organisationId) => {
    setIsModalOpen(false)
    setCurrentChallengeById(null)
    setCurrentOrganisationById(organisationId)
    history.push(`${ROUTES.ORGANISATIONS}/${organisationId}`)
    M.toast({ html: "Organisation créée !" })
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
      header="Nouvelle Organisation"
      trigger={
        <Button type="primary" danger>
          Nouvelle Organisation
        </Button>
      }
    >
      <OrganisationForm onCreated={handleOrganisationCreated} />
    </Modal>
  )
}
