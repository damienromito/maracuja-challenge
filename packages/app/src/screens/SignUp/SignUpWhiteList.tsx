import { IonContent, IonPage } from "@ionic/react"
import ERROR_CODES from "@maracuja/shared/constants/errorCodes"
import { Team } from "@maracuja/shared/models"
import { Field, Form, Formik } from "formik"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import * as Yup from "yup"
import {
  Button,
  Container,
  ErrorLabel,
  FormikErrorLabel,
  HelpLink,
  NavBar,
  RegularLink,
  Spinner,
  Text2,
  Title2,
} from "../../components"
import ROUTES from "../../constants/routes"
import { useAuthUser, useCurrentChallenge } from "../../contexts"

export default () => {
  const { currentChallenge } = useCurrentChallenge()
  const { authUser } = useAuthUser()

  const history = useHistory()

  const [authError, setAuthError] = useState(null)
  const [loading, setLoading] = useState(false)

  let formInput = null

  useEffect(() => {
    if (formInput) formInput.focus()
  }, [])

  const formSchema = Yup.object().shape({
    email: Yup.string()
      .required("L'email n'est pas correct")
      .matches(/^[A-Z0-9._%+-]+@(?!yopmail.com)[A-Z0-9.-]+\.[A-Z]{2,10}$/i, "L'email n'est pas correct"),
  })

  const onSubmit = async (values) => {
    const email = values.email.trim().toLowerCase()
    setLoading(true)

    const result = await currentChallenge.checkPlayerInWhiteList({ email })

    if (result.error) {
      const err = result.error
      setLoading(false)
      if (err.code === ERROR_CODES.NOT_EXISTS) {
        setAuthError(err.message)
      } else if (err.code === ERROR_CODES.ALREADY_EXISTS) {
        if (window.confirm(err.message) === true) {
          history.push(ROUTES.SIGN_UP__EMAILPASSWORD, { user: { email } })
        }
      }
    } else {
      result.member.createdAtInWhitelist = result.member.createdAt
      const states = {
        team: new Team(result.team),
        user: result.member,
      }

      setLoading(false)
      history.push(`/signup-clubs/${states.team.id}`, states)
    }
  }

  return (
    <IonPage>
      <NavBar leftIcon="back" leftAction={() => history.goBack()} title="Inscription" />

      <IonContent>
        {loading && <Spinner />}
        <Container className="max-width-container" style={{ marginTop: 15 }}>
          <Formik
            initialValues={{ email: authUser?.email || "" }}
            validationSchema={formSchema}
            validateOnBlur={false}
            onSubmit={onSubmit}
          >
            {(props) => {
              const { values, isSubmitting, dirty } = props
              return (
                <Form>
                  <Title2>Es-tu dans la liste ? 😎</Title2>
                  <Text2 style={{ marginBottom: 9 }}>{currentChallenge.audience.whitelistMessage}</Text2>

                  <Field
                    innerRef={(input) => {
                      formInput = input
                    }}
                    type="email"
                    name="email"
                    placeholder="Ton adresse email"
                    data-test="input-whitelist-email"
                  />
                  <FormikErrorLabel value="email" />
                  <ErrorLabel>{authError}</ErrorLabel>
                  <Button
                    type="submit"
                    disabled={!values.email || isSubmitting}
                    className="ion-margin-vertical"
                    data-test="button-submit"
                  >
                    S'inscrire
                  </Button>
                </Form>
              )
            }}
          </Formik>

          <RegularLink
            onClick={() => {
              history.push(ROUTES.SIGN_UP__EMAILPASSWORD)
            }}
          >
            Déjà inscrit.e au challenge ? Connexion{" "}
          </RegularLink>
          <HelpLink label="signup-whitelist" />
        </Container>
      </IonContent>
    </IonPage>
  )
}
