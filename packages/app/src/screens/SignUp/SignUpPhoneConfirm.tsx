import { Field, Form, Formik } from "formik"
import React, { Fragment, useEffect, useState } from "react"
import * as Yup from "yup"
import { Container, ErrorLabel, FormikErrorLabel, NavBar, Spinner } from "../../components"
import ROUTES from "../../constants/routes"

const ERROR_PHONE_CODE_INVALID = "auth/invalid-verification-code"
const ERROR_MESSAGE_PHONE_CODE_INVALID =
  "Le code de validation que tu as entré est non-valide. Verifie le code et essaie à nouveau."
const ERROR_PHONE_INTERNAL_ERROR = "auth/internal-error"
const ERROR_MESSAGE_PHONE_INTERNAL_ERROR = "Erreur serveur."
const ERROR_PHONE_CODE_EXPIRED = "auth/code-expired"
const ERROR_MESSAGE_PHONE_CODE_EXPIRED = "The SMS code has expired. Please re-send the verification code to try again."

const SignUpPhoneConfirm = ({ history, location }) => {
  const [confirmationError, setConfirmationError] = useState("")
  const [phoneCode] = useState("")
  const [loading, setLoading] = useState(false)

  let formInput = null
  useEffect(() => {
    if (formInput) {
      formInput.focus()
    }
  }, [])

  const formSchema = Yup.object().shape({
    phoneCode: Yup.string().length(6, "Le code est incorrect"),
  })

  const onChange = (value, setSubmitting) => {
    if (value.length === 6) {
      onSubmit(value, setSubmitting)
    }
  }

  const onSubmit = (code, setSubmitting) => {
    setLoading(true)
    setSubmitting(true)
    //@ts-ignore
    window.confirmationResult
      .confirm(code)
      .then((data) => {
        location.state.additionalUserInfo = data.additionalUserInfo
        return history.push(ROUTES.SIGN_UP__CONFIRM, location.state)
      })
      .catch((err) => {
        setSubmitting(false)
        if (err.code === ERROR_PHONE_CODE_INVALID) {
          setConfirmationError(ERROR_MESSAGE_PHONE_CODE_INVALID)
          setLoading(false)
        } else if (err.code === ERROR_PHONE_INTERNAL_ERROR) {
          setConfirmationError(ERROR_MESSAGE_PHONE_INTERNAL_ERROR)
          setLoading(false)
        } else if (err.code === ERROR_PHONE_CODE_EXPIRED) {
          setConfirmationError(ERROR_MESSAGE_PHONE_CODE_EXPIRED)
          setLoading(false)
        }
      })
  }
  const isSigningUp = location.state && location.state.user

  return (
    <>
      {loading && <Spinner />}

      <NavBar
        leftIcon="back"
        leftAction={() => history.goBack()}
        title={isSigningUp ? `Inscription de ${location.state.user.firstName}` : "Connexion"}
      />
      <Container>
        <p>Entre les 6 chiffres que nous avons envoyés au {location.state.phoneNumber} :</p>
        <br />
        {/* @ts-ignore */}
        <Formik
          innerRef={(f) => {
            const formik = f
          }}
          initialValues={{ phoneCode: phoneCode }}
          validationSchema={formSchema}
        >
          {({ isSubmitting, handleChange, setSubmitting }) => {
            return (
              <Form>
                <Field
                  innerRef={(input) => {
                    formInput = input
                  }}
                  type="tel"
                  pattern="[0-9]*"
                  name="phoneCode"
                  disabled={isSubmitting}
                  onChange={(e) => {
                    handleChange(e)
                    onChange(e.currentTarget.value, setSubmitting)
                  }}
                  placeholder="_ _ _ _ _ _"
                />
                <FormikErrorLabel value="phoneCode" />
              </Form>
            )
          }}
        </Formik>
        <ErrorLabel>{confirmationError}</ErrorLabel>
      </Container>
    </>
  )
}

export default SignUpPhoneConfirm
