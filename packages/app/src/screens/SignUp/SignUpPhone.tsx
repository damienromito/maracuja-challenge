import { Field, Form, Formik } from "formik"
import firebase from "firebase/app"

import React, { useEffect, useRef, useState } from "react"
import * as Yup from "yup"
import { Button, Container, FormikErrorLabel, HelpLink, NavBar, RegularLink, Spinner, Text2 } from "../../components"
import ROUTES from "../../constants/routes"
import { useApi } from "../../contexts"
import { styled } from "../../styles"

const CGU = styled(Text2)`
  line-height: 25px;
  margin: 15px 10px;
  a {
    text-decoration: underline;
  }
`
const SignUpPhone = ({ history, location }) => {
  const api = useApi()
  const recaptcha = useRef(null)

  const [loading, setLoading] = useState(false)

  let formInput = null

  useEffect(() => {
    if (formInput) formInput.focus()
    //@ts-ignore
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
      // size: "normal"
      size: "invisible",
    })
    //@ts-ignore
    window.recaptchaVerifier.render().then((widgetId) => (window.recaptchaWidgetId = widgetId))
  }, [])

  const formSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .required("Entre ton numéro de téléphone")
      .matches(/^0[1-9](\d{2}){4}$/, "Numéro de téléphone non valide (ex : 0634127856)"),
  })

  const onSubmit = (values, { setSubmitting }) => {
    setLoading(true)
    setSubmitting(false)
    const phone = "+33" + values.phoneNumber.substr(1)
    //@ts-ignore
    const appVerifier = window.recaptchaVerifier

    firebase
      .auth()
      .signInWithPhoneNumber(phone, appVerifier)
      .then((confirmResult) => {
        //@ts-ignore
        window.confirmationResult = confirmResult
        setLoading(false)

        // IF CLUB PICKED
        if (location.state && location.state.user) {
          location.state.user.phoneNumber = location.state.phoneNumber = phone
          history.push(ROUTES.SIGN_UP__PHONE_CONFIRM, location.state)
        } else {
          history.push(ROUTES.SIGN_UP__PHONE_CONFIRM, { phoneNumber: phone })
        }
      })
      .catch((err) => {
        alert(
          "Une erreur est survenue, ressayez ou contactez notre équipe technique à bonjour@maracuja.ac. Merci de nous transmettre le message : " +
            err.message
        )
      })
  }

  const isSigningUp = location.state && location.state.user

  return (
    <>
      {loading && <Spinner />}
      <NavBar
        leftIcon="back"
        leftAction={() => history.goBack()}
        title={`${isSigningUp ? "Inscription" : "Connexion"} par téléphone`}
      />
      <Container>
        <div ref={recaptcha} id="recaptcha-container" />

        <Formik
          initialValues={{ phoneNumber: "", cgu: false }}
          // initialValues={{phoneNumber : "0111111111",cgu:false }}
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
                  type="tel"
                  // value="0111111111"
                  name="phoneNumber"
                  pattern="[0-9]*"
                  placeholder="Ton numéro de téléphone"
                />
                <FormikErrorLabel value="phoneNumber" />

                <Button type="submit" disabled={isSubmitting}>
                  Envoyer
                </Button>
              </Form>
            )
          }}
        </Formik>
        <HelpLink label="signup-phone" />
        {!isSigningUp && (
          <RegularLink
            onClick={() => {
              history.push(ROUTES.SIGN_UP)
            }}
          >
            Créer un compte
          </RegularLink>
        )}
      </Container>
    </>
  )
}

export default SignUpPhone
