import { Field } from "formik"
import React from "react"
import { Text2, Title1 } from "../../../components"
import { useCurrentChallenge } from "../../../contexts"

const EditName = () => {
  const { currentChallenge, currentPhase } = useCurrentChallenge()
  return currentPhase.captainEditTeam.name ? (
    <>
      <Title1>Un nom à la hauteur de ton {currentChallenge.wording.tribe}</Title1>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
        <Text2 style={{ height: "50px" }}>Il sera scandé par les supporters et restera gravé dans les mémoires.</Text2>
      </div>
      <Field
        style={{ marginTop: "15px", height: "75px" }}
        id="name"
        type="text"
        name="name"
        placeholder="Entre le nom ici "
        data-test="input-name"
      />
    </>
  ) : (
    <i>Modification du nom désactivé</i>
  ) // Normaly not show it's a protection message print against bypass to block user when edit name feature is forbidden
}

export default EditName
