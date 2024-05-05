import { IonContent, IonPage } from "@ionic/react"
import { User } from "@maracuja/shared/models"
import firebase from "firebase/app"
import { Field, Form, Formik } from "formik"
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import * as Yup from "yup"
import {
  Button,
  Container,
  ErrorLabel,
  FormikErrorLabel,
  HelpLink,
  Modal,
  NavBar,
  Popup,
  RegularLink,
  Spinner,
  Text3,
} from "../../components"
import ROUTES from "../../constants/routes"
import { useCurrentChallenge } from "../../contexts"

const ERROR_CODE_ACCOUNT_NOT_FOUND = "auth/user-not-found"
const ERROR_MESSAGE_ACCOUNT_NOT_FOUND = "Le mot de passe est incorrect ou ce compte n'existe pas."
const ERROR_CODE_EMAIL_ALREADY_IN_USE = "auth/email-already-in-use"
const ERROR_CODE_EMAIL_EXISTS = "auth/email-already-exists"
const ERROR_CODE_UID_EXISTS = "auth/uid-already-exists"
const ERROR_CODE_AUTH_TOOMANYREQUESTS = "auth/too-many-requests"
const ERROR_MESSAGE_AUTH_TOOMANYREQUESTS =
  "Votre compte a été temporairement désactivé dû à un grand nombre de tentative de connexion. Réessayez plus tard."
const ERROR_MSG_ACCOUNT_EXISTS = "Un compte existe avec cet email. S'inscrire avec ce compte ?"
const ERROR_CODE_WRONG_PASSWORD = "auth/wrong-password"
const ERROR_MESSAGE_WRONG_PASSWORD = "Le mot de passe est incorrect ou ce compte n'existe pas."
const ERROR_CODE_WEAK_PASSWORD = "auth/weak-password"
const ERROR_MESSAGE_WEAK_PASSWORD = "😕 Ton mot de passe est trop simple, il doit contenir au moins 6 caractères."

export default ({ history, location }) => {
  const { currentChallenge } = useCurrentChallenge()

  const [alreadySubscribedPopupOpened, setAlreadySubscribedPopupOpened] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [isSigningUp, setIsSigningUp] = useState(location.state?.isSigningUp)
  const [loading, setLoading] = useState(false)
  const [passwordError, setPasswordError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  let formInput = null

  useEffect(() => {
    if (formInput) formInput.focus()
  }, [])

  const formSchema = Yup.object().shape({
    password: Yup.string()
      .required("Et le mot de passe ?")
      .min(isSigningUp ? 8 : 0, "Trop court ! 8 caractères minimum."),
    email: Yup.string()
      .required("L'email n'est pas correct")
      .matches(/^[A-Z0-9._%+-]+@(?!yopmail.com)[A-Z0-9.-]+\.[A-Z]{2,10}$/i, "L'email n'est pas correct"),
  })

  const onSubmit = async (values) => {
    setLoading(true)
    setAuthError(null)
    const email = values.email.trim().toLowerCase()
    const password = values.password

    if (isSigningUp) {
      await createAuthUser({ email, password })
    } else {
      await loginAuthUser({ email, password })
    }
  }

  const loginAuthUser = async ({ email, password, isNew = false }) => {
    console.log("!!!LOGIN ", email)

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
      const states = location.state || {}
      !states.user && (states.user = {})
      if (isNew) {
        states.user.isNew = isNew
      }
      states.user.email = email
      history.push(ROUTES.SIGN_UP__CONFIRM, states)
    } catch (error) {
      console.log("LOGIN error", error)
      if (error.code === ERROR_CODE_WRONG_PASSWORD) {
        setAuthError(ERROR_MESSAGE_WRONG_PASSWORD)
      } else if (error.code === ERROR_CODE_ACCOUNT_NOT_FOUND) {
        setAuthError(ERROR_MESSAGE_ACCOUNT_NOT_FOUND)
      } else if (error.code === ERROR_CODE_AUTH_TOOMANYREQUESTS) {
        setAuthError(ERROR_MESSAGE_AUTH_TOOMANYREQUESTS)
      }
      setLoading(false)
    }
  }

  const handleClickSwitchSignIn = () => {
    setIsSigningUp(false)
    // delete location.state.user
  }

  const handleClickSignInBecauseExists = async (email, password) => {
    setLoading(true)
    setIsSigningUp(false)
    setAlreadySubscribedPopupOpened(false)
    await loginAuthUser({ email: email.trim().toLowerCase(), password })
  }

  const createAuthUser = async ({ email, password }) => {
    const params = {
      email,
      password,
      username: location.state.user.username,
      userId: location.state.user?.id,
    }

    const response = await User.create(params)
    if (response.user) {
      console.log("SIGNUPPPP user:", response.user)
    } else if (response.error) {
      const error = response.error
      if (error.code === ERROR_CODE_WEAK_PASSWORD) {
        setPasswordError(ERROR_MESSAGE_WEAK_PASSWORD)
      } else if (
        error.code === ERROR_CODE_EMAIL_EXISTS ||
        error.code === ERROR_CODE_UID_EXISTS ||
        error.code === ERROR_CODE_EMAIL_ALREADY_IN_USE
      ) {
        handleClickSwitchSignIn()
        if (window.confirm(ERROR_MSG_ACCOUNT_EXISTS) === true) {
          return loginAuthUser({ email, password, isNew: true })
        }
      }
      setLoading(false)
      return false
    }
    return loginAuthUser({ email, password, isNew: true })
  }
  return (
    <IonPage>
      <NavBar leftIcon="back" leftAction={() => history.goBack()} title={isSigningUp ? "Inscription" : "Connexion"} />
      <IonContent>
        {loading && <Spinner />}
        <Container style={{ marginTop: 15 }}>
          <Formik
            initialValues={{
              email: location?.state?.user?.email || "",
              password: "",
            }}
            validationSchema={formSchema}
            validateOnBlur={false}
            onSubmit={onSubmit}
          >
            {(props) => {
              const { errors, touched, values } = props
              return (
                <>
                  <Form>
                    {isSigningUp && currentChallenge?.verifyEmail && (
                      <Text3 style={{ marginBottom: 9 }}>Tu recevras un e-mail pour valider ton inscription :</Text3>
                    )}
                    <Field
                      innerRef={(input) => {
                        formInput = input
                      }}
                      type="email"
                      autoFocus
                      name="email"
                      data-test="input-email"
                      placeholder="Ton adresse email"
                      disabled={!!location?.state?.user?.email}
                    />
                    <FormikErrorLabel value="email" />

                    <PasswordField>
                      {values.password && (
                        <div className="showButton" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? "Cacher" : "Montrer"}
                        </div>
                      )}
                      <Field
                        type={showPassword ? "text" : "password"}
                        name="password"
                        data-test="input-password"
                        placeholder="Ton mot de passe"
                        style={{ marginTop: 10 }}
                      />
                    </PasswordField>
                    <FormikErrorLabel value="password" />
                    <ErrorLabel>{passwordError}</ErrorLabel>
                    <ErrorLabel>{authError}</ErrorLabel>
                    <Button data-test="button-submit" type="submit" disabled={loading} className="ion-margin-vertical">
                      Envoyer
                    </Button>

                    {(passwordError || !isSigningUp) && (
                      <>
                        <Button
                          secondary
                          onClick={() => {
                            history.push(ROUTES.SIGN_UP__PASSWORD_FORGET, { email: values.email })
                          }}
                        >
                          Mot de passe oublié ?
                        </Button>
                        <RegularLink
                          onClick={() => {
                            history.push(ROUTES.HOME)
                          }}
                        >
                          Tu n'as pas de compte ? Inscription
                        </RegularLink>
                      </>
                    )}
                    {isSigningUp && (
                      <RegularLink onClick={handleClickSwitchSignIn}>Tu as déjà un compte ? Connexion</RegularLink>
                    )}

                    <HelpLink label="signup-email-pwd" />
                  </Form>
                  {alreadySubscribedPopupOpened && (
                    <Modal
                      isOpen={alreadySubscribedPopupOpened}
                      onClose={() => setAlreadySubscribedPopupOpened(false)}
                      closeButton
                      title="Super, tu as déjà un compte !"
                    >
                      {/* <p>Tu as déjà un compte sur l'application</p> */}
                      <Button onClick={() => handleClickSignInBecauseExists(values.email, values.password)}>
                        C'est parti !
                      </Button>
                    </Modal>
                  )}
                </>
              )
            }}
          </Formik>
        </Container>
      </IonContent>
    </IonPage>
  )
}

const PasswordField = styled.div`
  .showButton {
    float: right;
    color: ${(props) => props.theme.primary};
    position: absolute;
    font-size: 15px;
    right: 24px;
    padding: 38px 15px;
  }
`
