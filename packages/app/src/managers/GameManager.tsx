import React from "react"
import { useHistory, useLocation } from "react-router-dom"
import { Modal, Popup, Text2 } from "../components"

const GameManager = () => {
  const history = useHistory()
  const location: any = useLocation<any>()
  localStorage.removeItem("dataToSendGame")
  const dataToSendGame = localStorage.getItem("dataToSendGame")
    ? JSON.parse(localStorage.getItem("dataToSendGame"))
    : false

  return (
    <>
      {dataToSendGame && location.pathname.split("/")[1] !== "games" && (
        <Modal
          isOpen
          title="Ta partie n'as pas été enregistrée"
          validTextButton="Réessayer"
          closeButton
          validActionButton={() =>
            history.push(`/${dataToSendGame.questionSet.type}s/${dataToSendGame.questionSet.id}/congrats`)
          }
        >
          <Text2>
            Jeu : <strong>{dataToSendGame.questionSet.name}</strong>
          </Text2>
          <Text2>Vérifie ta connexion internet et clique sur le bouton "Réessayer"</Text2>
        </Modal>
      )}
    </>
  )
}

export { GameManager }
