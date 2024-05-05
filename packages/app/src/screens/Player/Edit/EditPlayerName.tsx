import { Field, useFormikContext } from "formik"
import React, { useEffect, useState } from "react"
import { Text2, Title1 } from "../../../components"
import { useCurrentChallenge } from "../../../contexts"
import styled from "styled-components"

const EditPlayerName = () => {
  const { currentChallenge, currentPlayer } = useCurrentChallenge()
  const [shirtName, setShirtName] = useState("")

  return (
    <>
      <Title1>Ton nom de {currentChallenge.wording.player}</Title1>
      <Text2 style={{ marginTop: "15px" }}>
        C’est sous ce nom que tu apparaitras ; choisis-en un que tes amis connaissent !
      </Text2>
      <PlayerShirt>
        <span className="icon icon-shirt shirt" />
        <span className="name">{shirtName || (currentPlayer.username ? currentPlayer.username : "name")}</span>
        <span className="number">{currentPlayer.number ? currentPlayer.number : 10}</span>
      </PlayerShirt>
      <Field style={{ height: "75px" }} id="username" type="text" name="username" placeholder="Entre le nom ici " />
      <AutoChangeNameShirt setShirtName={setShirtName} />
    </>
  )
}

export default EditPlayerName

const AutoChangeNameShirt = ({ setShirtName }) => {
  const formik = useFormikContext<any>()

  useEffect(() => {
    if (formik.values !== formik.initialValues) {
      setShirtName(formik.values.username)
    }
  }, [formik.values])
  return null
}

const PlayerShirt = styled.div`
  align-items: center;
  color: black;
  display: flex;
  flex-direction: column;
  font-family: Montserrat;
  font-weight: bold;
  height: 170px;
  justify-content: center;
  margin-top: 15px;
  position: relative;
  width: 100%;

  .shirt {
    display: flex;
    color: ${(props) => props.theme.icon.primary};
    font-size: 170px;
    position: absolute;
  }
  .name {
    font-size: 11px;
    line-height: 13px;
    position: absolute;
    top: 45px;
    z-index: 1;
  }

  .number {
    font-size: 33px;
    line-height: 40px;
    position: absolute;
    top: 65px;
    z-index: 1;
  }
`
