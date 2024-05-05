import { Button } from "@maracuja/shared/components"
import { useApi, useCurrentChallenge } from "@maracuja/shared/contexts"
import { objectSubset } from "@maracuja/shared/helpers"
import { Field, Formik } from "formik"
import React, { useState } from "react"
import styled from "styled-components"
import { useApp } from "../../../contexts"
import { Team } from "@maracuja/shared/models"

const MessageField = styled(Field)`
  margin-top: 15px;
  height: 177px;
  background: #ffffff;
  border: 1px solid #d8d8d8;
  box-sizing: border-box;
  border-radius: 8px;
`

export default ({ setShowPopup }) => {
  const { currentChallenge, currentTeam, currentPlayer } = useCurrentChallenge()
  const { loading, setLoading, logEvent } = useApp()

  const [isMotivate, setIsMotivate] = useState(false)

  const onSubmitFormMotivatePlayer = async (value) => {
    setLoading(true)
    const data = {
      challenge: objectSubset(currentChallenge, ["id", "name", "emailTemplateId", "emails"]),
      sender: objectSubset(currentPlayer, ["id", "username"]),
      team: objectSubset(currentTeam, ["id", "name"]),
      captainWording: currentChallenge.wording.captain,
      message: value.contentMessage,
    }
    logEvent("motivate team - send")
    try {
      await Team.motivatePlayers(data)
      setIsMotivate(true)
    } catch (error) {
      alert("Une erreur est survenue")
    }

    setLoading(false)
  }

  return (
    <>
      <Formik initialValues={{ contentMessage: "" }} onSubmit={onSubmitFormMotivatePlayer} enableReinitialize>
        {(formik) => {
          return (
            <>
              {!isMotivate ? (
                <>
                  <h1>Message du {currentChallenge.wording.captain}</h1>
                  <p>
                    En tant que {currentChallenge.wording.captain}, tu peux envoyer un message quotidien pour motiver
                    toute ton équipe.
                  </p>
                  <MessageField
                    component="textarea"
                    id="contentMessage"
                    type="text"
                    name="contentMessage"
                    placeholder="Écris ton message pour l'équipe"
                  />
                  <p className="example">{currentChallenge.wording.captainMotivationExample}</p>
                  <Button
                    onClick={() => {
                      formik.values.contentMessage.length > 0 && formik.submitForm()
                    }}
                    disabled={loading || !(formik.values.contentMessage.length > 0)}
                  >
                    Envoyer
                  </Button>
                </>
              ) : (
                <>
                  <h1>Message envoyé !</h1>
                  <Button
                    onClick={() => {
                      setShowPopup(false)
                    }}
                  >
                    Ok
                  </Button>
                </>
              )}
            </>
          )
        }}
      </Formik>
    </>
  )
}
