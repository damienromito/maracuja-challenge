import React, { useContext, useEffect, Fragment } from "react"
import styled from "styled-components"
import { Offline, Online } from "react-detect-offline"
import { Button, Popup, Spinner, Text2, RegularLink, Modal } from "../../components"

import { useHistory, useLocation } from "react-router-dom"

const OfflineBlock = styled(Text2)`
  width: 100%;
  position: absolute;
  text-align: center;
  z-index: 99999;
  padding: 4px;
  margin-top: 0px;
  font-weight: bold;
  background: ${(props) => props.theme.secondary};
`

const NetworkManager = (props) => {
  const history = useHistory()

  if (window.location.hostname === "localhost") return <>{props.children}</>
  return (
    <>
      {props.children}

      <Offline>
        <OfflineBlock>Tu n'es pas connecté à internet</OfflineBlock>
      </Offline>

      <Offline>
        <Modal
          isOpen
          title="Tu n'es pas connecté à internet"
          // validTextButton="OK"
          // validActionButton={() => activeNotification.data.redirect && history.push(activeNotification.data.redirect)}
          validActionButton={() => history.push("/settings")}
        >
          <Text2>Lorsque tu seras de nouveau connecté à internet, ce message disparaitra.</Text2>
          <Text2>
            ⚠️ Pendant une partie, une coupure d'internet te fera perdre du temps.{" "}
            <strong>Assure-toi d'avoir une bonne connexion avant de commencer.</strong>
          </Text2>
          <br />
        </Modal>
      </Offline>
    </>
  )
}

export default NetworkManager
