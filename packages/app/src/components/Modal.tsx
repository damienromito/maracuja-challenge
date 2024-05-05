import { IonModal } from "@ionic/react"
import React, { ReactNode } from "react"
import { size, styled } from "../styles"
import { Button, Title3 } from "./"

interface ModalProps {
  isOpen?: boolean
  children?: ReactNode
  validTextButton?: any
  validActionButton?: any
  closeButton?: any
  title?: any
  onClose?: any
}

export default ({ isOpen, children, validTextButton, validActionButton, closeButton, title, onClose }: ModalProps) => {
  return (
    <IonModal
      isOpen={isOpen}
      // closeOnDocumentClick={false}
      onDidDismiss={onClose}
      backdropDismiss={true}
    >
      <PopupContainer className="popup-content">
        {/* TODO close button optional */}
        {/* {closeButton && ( */}
        <div className="close">
          <a
            onClick={() => {
              onClose && onClose()
            }}
          >
            &times;
          </a>
        </div>
        {/* )} */}

        <Content className="max-width-container">
          {title && <Title3>{title}</Title3>}
          <div className="children">{children}</div>
          {validTextButton && (
            <Button
              className="defaultButton"
              onClick={() => {
                validActionButton && validActionButton()
                onClose && onClose()
              }}
            >
              {validTextButton}
            </Button>
          )}
        </Content>
      </PopupContainer>
    </IonModal>
  )
}

const Content = styled.div``
const PopupContainer = styled.div`
  overflow: scroll;
  max-height: 100%;
  width: calc(100% - 30px) !important ;
  color: black;
  border-radius: ${size.borderRadius};
  background: red;
  padding: 25px 30px 25px 25px !important;
  margin: auto 15px !important;
  position: relative;
  background: #ffffff;
  border-radius: 13px;
  color: #000000;
  margin-top: 15px;
  padding: 8px;
  text-align: center;
  h1 {
    font-weight: bold;
    font-size: 18px;
    line-height: 20px;
  }

  h3 {
    margin-bottom: 10px;
  }

  .children a {
    color: black;
    text-decoration: underline;
  }
  .close {
    text-align: right;
    /* padding-bottom : 10px; */
    a {
      color: black;
      width: 30px;
      height: 30px;
      cursor: pointer;
      text-align: center;
      font-size: 30px;
    }
  }
  button.defaultButton {
    margin-top: 10px;
  }
`
