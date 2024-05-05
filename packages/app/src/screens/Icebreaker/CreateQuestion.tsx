import { IonContent, IonPage } from "@ionic/react"
import { Text1 } from "@maracuja/shared/components"
import { useAuthUser } from "@maracuja/shared/contexts"
import { objectSubset } from "@maracuja/shared/helpers"
import { Icebreaker } from "@maracuja/shared/models"
import { Form, Formik } from "formik"
import React, { useMemo } from "react"
import { useHistory } from "react-router-dom"
import * as Yup from "yup"
import { Button, Container, NavBar } from "../../components"
import FormikFieldContainer from "../../components/FormikFieldContainer"
import ROUTES from "../../constants/routes"
import { useApp, useCurrentChallenge } from "../../contexts"
import IcebreakerExampleImgSrc from "../../images/icebreakerExample.png"
import styled from "styled-components"
export default () => {
  const { currentPlayer, currentChallenge } = useCurrentChallenge()
  const { authUser } = useAuthUser()
  const { setLoading } = useApp()
  const history = useHistory()

  const handleSubmitForm = async (values, { setSubmitting }) => {
    setLoading(true)

    try {
      await Icebreaker.createQuestion({
        ...objectSubset(values, ["truth1", "truth2", "lie"]),
        playerId: currentPlayer.id,
        challengeId: currentChallenge.id,
      })
    } catch (error) {
      setLoading(false)

      return
    }
    setLoading(false)
    history.push(ROUTES.ICEBREAKER_CREATE_QUESTION_SUCCESS)
  }

  const handleClose = () => {
    history.push(ROUTES.HOME)
  }

  const initValues = useMemo(() => {
    let defaultValues
    if (authUser.icebreakerQuestion) {
      const choices = authUser.icebreakerQuestion.choices.split("|")
      defaultValues = {
        truth1: choices[0],
        truth2: choices[1],
        lie: choices[2],
      }
    } else {
      defaultValues = {
        truth1: "",
        truth2: "",
        lie: "",
      }
    }
    return defaultValues
  }, [])

  return (
    <IonPage>
      <NavBar rightIcon="close" rightAction={handleClose} title="2 vérités 1 mensonge" />
      <IonContent>
        <PageContainer className="max-width-container">
          <Text1>Crée une question sur toi pour défier tes coéquipiers ! </Text1>
          <div style={{ margin: "5px 0" }}>
            <img src={IcebreakerExampleImgSrc} />
          </div>

          <Formik
            initialValues={initValues}
            validationSchema={Yup.object().shape({
              truth1: Yup.string().required("Champs requis.").min(3, "Développe un peu stp ! 😜"),
              truth2: Yup.string().required("Champs requis.").min(3, "Développe un peu stp ! 😜"),
              lie: Yup.string().required("Champs requis.").min(3, "Développe un peu stp ! 😜"),
            })}
            validateOnBlur={false}
            onSubmit={handleSubmitForm}
          >
            {(props) => {
              const { errors, touched, isSubmitting, dirty } = props
              return (
                <Form>
                  <FormikFieldContainer
                    type="text"
                    name="truth1"
                    label="Une première anecdote vraie sur toi :"
                    placeholder="Ecris une vérité"
                  />
                  <FormikFieldContainer
                    type="text"
                    name="truth2"
                    label="Une seconde anecdote vraie sur toi :"
                    placeholder="Ecris une vérité"
                  />
                  <FormikFieldContainer
                    type="text"
                    name="lie"
                    label="Une anecdote fausse sur toi :"
                    placeholder="Ecris un mensonge"
                  />

                  <Button
                    type="submit"
                    disabled={!authUser.icebreakerQuestion && (!dirty || isSubmitting)}
                    className="ion-margin-vertical"
                  >
                    {authUser.icebreakerQuestion ? "Modifier ma question" : "Ajouter ma question"}
                  </Button>
                </Form>
              )
            }}
          </Formik>
        </PageContainer>
      </IonContent>
    </IonPage>
  )
}

const PageContainer = styled(Container)`
  background: ${(props) => props.theme.primary};
  padding: 15px;
`
