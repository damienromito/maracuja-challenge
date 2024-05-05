import { IonContent, IonPage } from "@ionic/react"
import firebase from "firebase/app"
import { Field, Form, Formik } from "formik"

import { useEffect, useState } from "react"
import * as Yup from "yup"
import { Button, Container, ErrorLabel, FormikErrorLabel, NavBar, RegularLink, Spinner, Text2 } from "../../components"
import ROUTES from "../../constants/routes"

const ERROR_CODE_ACCOUNT_NOT_FOUND = "auth/user-not-found"
const ERROR_MESSAGE_ACCOUNT_NOT_FOUND = "Aucun compte n'existe pour cet adresse e-mail."

const SignUpPasswordForget = ({ history, location }) => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState(null)
  const [authError, setAuthError] = useState(null)

  let formInput = null

  useEffect(() => {
    if (formInput) formInput.focus()
  }, [])

  const formSchema = Yup.object().shape({
    // email: Yup.string().email("L'email n'est pas correct")
    email: Yup.string()
      .required("L'email n'est pas correct")
      .matches(/^[A-Z0-9._%+-]+@(?!yopmail.com)[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "L'email n'est pas correct"),
    // .matches(/.*@(?!yopmail\.com).*$/g, "L'email n'est pas correct")
  })

  const onSubmit = (values, { setSubmitting }) => {
    setSubmitting(false)
    const emailValue = values.email.trim().toLowerCase()

    setLoading(true)

    firebase
      .auth()
      .sendPasswordResetEmail(emailValue)
      .then(() => {
        setLoading(false)
        setEmail(emailValue)
      })
      .catch((error) => {
        setLoading(false)
        if (error.code === ERROR_CODE_ACCOUNT_NOT_FOUND) {
          setAuthError(ERROR_MESSAGE_ACCOUNT_NOT_FOUND)
        }
      })
  }

  return (
    <IonPage>
      {loading && <Spinner />}
      <IonContent>
        <NavBar leftIcon="back" leftAction={() => history.goBack()} title="Mot de passe oublié" />
        <Container>
          <Text2>
            Indique ci-dessous l'e-mail avec lequel tu t'es inscrit ; tu recevras un e‑mail contenant un lien te
            permettant de définir ton nouveau mot de passe.
          </Text2>
          <br />
          {!email ? (
            <>
              <Formik
                initialValues={{ email: location?.state?.email || "" }}
                validationSchema={formSchema}
                onSubmit={onSubmit}
              >
                {(props) => {
                  const { errors, touched, isSubmitting, dirty } = props
                  return (
                    <Form>
                      <Field
                        innerRef={(input) => {
                          formInput = input
                        }}
                        type="email"
                        name="email"
                        placeholder="Ton adresse email"
                      />
                      <FormikErrorLabel value="email" />

                      <Button type="submit" disabled={isSubmitting} className="ion-margin-vertical">
                        Valider
                      </Button>
                      <ErrorLabel>{authError}</ErrorLabel>
                    </Form>
                  )
                }}
              </Formik>
              <RegularLink
                onClick={() => {
                  history.push(ROUTES.SIGN_UP)
                }}
              >
                Créer un compte
              </RegularLink>
            </>
          ) : (
            <p style={{ textAlign: "center" }}>
              Un email te permettant de renseigner ton nouveau mot de passe a été envoyé à {email}.
            </p>
          )}
        </Container>
      </IonContent>
    </IonPage>
  )
}

export default SignUpPasswordForget
