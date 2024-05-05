import { IonContent, IonPage, useIonToast } from "@ionic/react"
import { ERROR_CODES } from "@maracuja/shared/constants"
import { Team } from "@maracuja/shared/models"
import { Form, Formik } from "formik"
import React, { useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import * as Yup from "yup"
import {
  Button,
  Container,
  ErrorLabel,
  FormikFieldContainer,
  HelpLink,
  NavBar,
  RegularLink,
  Text1,
} from "../../components"
import { useApp, useCurrentChallenge } from "../../contexts"
import { signupRouteForAudience } from "../../utils/helpers"

const SignUpReferral = () => {
  const { currentChallenge } = useCurrentChallenge()
  const { setLoading } = useApp()
  const history = useHistory()
  const location = useLocation<any>()
  const [present] = useIonToast()

  const [error, setError] = useState("")

  const formSchema = Yup.object().shape({
    referralCode: Yup.string().min(
      4,
      "Il s'agit d'un code à 4 caractères, des chiffres et/ou des lettres. Respecte bien les minuscules et les majuscules."
    ),
  })

  const onSubmit = async (values, { setSubmitting }) => {
    setLoading(true)

    try {
      const result = await currentChallenge.checkReferralCode({ code: values.referralCode })
      if (result.error) {
        if (result.error.code === ERROR_CODES.NOT_EXISTS) {
          setError("Ce code de parrainage n'existe pas. Respecte bien les minuscules et les majuscules.")
        }
      } else {
        const state = {
          team: new Team(result.team),
          user: result.player,
        }
        history.push(`/signup-clubs/${state.team.id}`, state)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }

  const initValues = useMemo(() => {
    const codeInUrl = new URLSearchParams(location.search).get("code")
    if (codeInUrl) {
      present("Code de parrainage copié !", 3000)
    }
    return { referralCode: codeInUrl || "" }
  }, [])

  const handleClickSignup = () => {
    const signupRoute = signupRouteForAudience(currentChallenge.audience)
    history.push(signupRoute)
  }

  return (
    <IonPage>
      <NavBar leftIcon="back" leftAction={() => history.goBack()} title="Je suis parrainé" />
      <IonContent>
        <Container>
          <Formik initialValues={initValues} validationSchema={formSchema} onSubmit={onSubmit}>
            {(props) => {
              const { isSubmitting, values } = props
              return (
                <Form>
                  <Text1>Un.e ami.e t’a envoyé un code de parrainage pour rejoindre son équipe ! 😎</Text1>
                  <Text1>
                    Entre le code pour rejoindre le challenge <strong>{currentChallenge.name} 🏆</strong> en tant que{" "}
                    {currentChallenge.wording.referee} :{" "}
                  </Text1>
                  <FormikFieldContainer
                    style={{ margin: "8px 0" }}
                    autoFocus
                    type="text"
                    name="referralCode"
                    placeholder="Entre le code de parrainage"
                  />
                  <ErrorLabel>{error}</ErrorLabel>
                  <Button type="submit" disabled={isSubmitting || values.referralCode === ""}>
                    Valider
                  </Button>
                  <br />
                  <br />
                  <RegularLink data-test="button-login" onClick={handleClickSignup}>
                    Tu n'as de code de parrainage ? Inscris-toi{" "}
                  </RegularLink>

                  <HelpLink label="signup-referral" footer={"Code : " + (values.referralCode || "non défini")} />
                </Form>
              )
            }}
          </Formik>
        </Container>
      </IonContent>
    </IonPage>
  )
}

export default SignUpReferral
