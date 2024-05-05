import { IonModal } from "@ionic/react"
import React, { useState } from "react"
import { Button, Container } from "../../../components"
import { styled } from "../../../styles"
import FormMotivation from "./FormMotivation"
import { useApp } from "../../../contexts"

export default ({ disabledButton }) => {
  const [showPopup, setShowPopup] = useState(null)
  const { logEvent } = useApp()

  return (
    <>
      <Button
        style={{ marginBottom: 5 }}
        onClick={() => {
          setShowPopup(true)
          logEvent("motivate team - open")
        }}
        disabled={disabledButton}
      >
        ✊ MOTIVER TON ÉQUIPE
      </Button>
      <IonModal isOpen={showPopup}>
        <MotivationPopup>
          <div className="message">
            <Container className="content">
              <div
                onClick={() => {
                  setShowPopup(false)
                }}
                className="icon icon-close"
                style={{ textAlign: "right", color: "black", fontSize: "20px" }}
              />
              <FormMotivation setShowPopup={setShowPopup} />
            </Container>
          </div>
        </MotivationPopup>
      </IonModal>
    </>
  )
}

const MotivationPopup = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  width: 100vw;
  z-index: 1;

  .message {
    position: relative;
    width: 358px;
    background: #ffffff;
    border-radius: 13px;
    font-family: "Open Sans";

    .content {
      padding: 17px 18px;
    }

    h1 {
      font-weight: bold;
      font-size: 18px;
      line-height: 20px;
      color: #000000;
      margin-top: 10px;
      text-align: center;
    }
    p {
      font-size: 19px;
      line-height: 26px;
      color: #000000;
      margin-top: 15px;
    }

    .example {
      font-style: italic;
      font-size: 13px;
      line-height: 20px;
    }

    Button {
      margin-top: 15px;
      width: 100%;
    }
  }
`
