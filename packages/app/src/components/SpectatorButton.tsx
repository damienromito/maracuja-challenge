import React, { useState } from "react"
import { ACTIVITY_TYPES } from "@maracuja/shared/constants"
import { useCurrentChallenge } from "../contexts"
import { size, styled } from "../styles"
import Popup from "./Popup"
import Modal from "./Modal"

const ButtonContainer = styled.div`
  background: ${(props) => props.theme.bg.info};
  color: black;
  border-radius: ${size.borderRadius};
  font-size: 15px;
  padding: 3px 10px;
  width: fit-content;
  margin-top: 3px;

  i:before {
    font-size: 17px;
    position: relative;
    float: right;
    margin-top: -1px;
    margin-left: 2px;
  }
`

const SpectatorButton = (props) => {
  const { currentRanking, currentChallenge, currentQuestionSet } = useCurrentChallenge()
  const [popupOpened, setPopupOpened] = useState<any>(false)

  return (
    <ButtonContainer
      onClick={(e) => {
        setPopupOpened(true)
        e.stopPropagation()
      }}
      {...props}
    >
      Tu es spectateur <i className="icon-help" />
      <Modal isOpen={popupOpened} onClose={() => setPopupOpened(false)} title="Le mode spectateur" validTextButton="OK">
        {currentRanking && currentRanking.currentTeamSelected ? (
          <p>
            Ton {currentChallenge.wording.tribe} doit être inscrit au <strong>{currentChallenge.name}</strong> pour
            participer au Maracuja Challenge. En tant que spectateur tu peux tout de même suivre la compétition.{" "}
          </p>
        ) : (
          <p>
            Ton {currentChallenge.wording.tribe} n'a pas été selectionné. Mais, en tant que spectateur, tu peux tout de
            même {currentQuestionSet?.type === ACTIVITY_TYPES.TRAINING ? "t'entrainer" : "suivre la compétition"} !{" "}
          </p>
        )}
      </Modal>
    </ButtonContainer>
  )
}
export default SpectatorButton
