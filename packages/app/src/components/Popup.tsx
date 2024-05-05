import React, { Fragment } from "react"
import { styled, size } from "../styles"
import { Button, Title3 } from "./"
// import { IoIosArrowForward } from "react-icons/io";
import ReactPopup from "reactjs-popup"

interface PopupProps {
  title?: string
  open: boolean
  onClose?: any
  children?: any
  trigger?: any
  validTextButton?: string
  validActionButton?: any
  closeButton?: any
}

const Popup = ({
  open,
  onClose,
  children,
  trigger,
  validTextButton,
  validActionButton,
  closeButton,
  title = "",
}: PopupProps) => {
  return open ? (
    <PopupContainer>
      <ReactPopup
        modal
        open={open}
        closeOnDocumentClick={false}
        onClose={onClose}
        trigger={trigger}
        position="right center"
      >
        {(close) => (
          <>
            {closeButton && (
              <div className="close">
                <a onClick={() => close()}>&times;</a>
              </div>
            )}

            <Content className="max-width-container">
              {title && <Title3>{title}</Title3>}
              <div className="children">{children}</div>
              {validTextButton && (
                <Button
                  className="defaultButton"
                  onClick={() => {
                    if (validActionButton) {
                      validActionButton()
                    }
                    close()
                  }}
                >
                  {validTextButton}
                </Button>
              )}
            </Content>
          </>
        )}
      </ReactPopup>
    </PopupContainer>
  ) : null
}
export default Popup

const Content = styled.div``
const PopupContainer = styled.div`
  .popup-content {
    overflow: scroll;
    max-height: 100%;
    width: calc(100% - 30px) !important ;
    color: black;
    border-radius: ${size.borderRadius};
    background: red;
    padding: 25px 30px 25px 25px !important;
    margin: auto 15px !important;
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
  }
`
