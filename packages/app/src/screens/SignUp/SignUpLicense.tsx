import { IonContent, IonPage } from "@ionic/react"
import { ERROR_CODES } from "@maracuja/shared/constants"
import { Player, Team } from "@maracuja/shared/models"
import { Form, Formik } from "formik"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import * as Yup from "yup"
import {
  Button,
  Container,
  ErrorLabel,
  FormikFieldContainer,
  HelpLink,
  NavBar,
  RegularLink,
  Spinner,
  Text2,
  Title2,
} from "../../components"
import ROUTES from "../../constants/routes"
import { useApi, useApp, useAuthUser, useCurrentChallenge } from "../../contexts"
import SignUpClubLicensePopup from "./SignUpClubLicensePopup"

// https://github.com/maracuja-academy/challenge-app/blob/0f208f1e633fc354f9348a3892442d6863f1a98b/src/screens/SignUp/SignUpClub.js
export default () => {
  const { currentChallenge } = useCurrentChallenge()
  const { openError, openAlert, logEvent } = useApp()
  const { authUser } = useAuthUser()
  const api = useApi()
  const history = useHistory()

  const [authError, setAuthError] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [licenseNumber, setLicenseNumber] = useState(undefined)
  const [openVerificationWithInformations, setOpenVerificationWithInformations] = useState(undefined)

  const formSchema = Yup.object().shape({
    licenseNumber: Yup.string()
      .trim()
      .matches(/^\d{7}\D$/, "Le format de licence n'est pas correct. (7 chiffres + 1 lettre) ")
      .required(""),
  })

  const handleSubmit = async (values) => {
    setLicenseNumber(values.licenseNumber)
    setLoading(true)
    try {
      const result = await currentChallenge.checkPlayerLicense({ licenseNumber: values.licenseNumber })
      if (!result.exists || result.code) {
        setAuthError(result.message)
      } else {
        if (result.club || result.team) {
          const state = {
            team: new Team(result.team || result.club),
            user: new Player(result.licensee),
          }
          setOpenVerificationWithInformations(state)
          // } else {
          //   goNext(state)
        } else if (result.licensee) {
          const state = { user: new Player(result.licensee) }
          history.push(ROUTES.SIGN_UP_CLUBPICKER, state)
        } else {
          openError()
        }
      }
      setLoading(false)
    } catch (err) {
      if (err.code === ERROR_CODES.NOT_EXISTS) {
        openAlert({
          title: "Club inconnu",
          message:
            "Le club correspondant à ce numéro de license n'a pas été trouvé, merci de nous contacter à bonjour@maracuja.ac",
        })
      } else {
        openError(JSON.stringify(err))
      }
      setLoading(false)
    }
  }

  const goNext = (nextLocationState) => {
    history.push(`/signup-clubs/${nextLocationState.team.id}`, nextLocationState)
  }

  const handleLicenseUnknown = () => {
    openAlert({
      title: "Retrouve ton numéro de licence depuis le site de la FFE :",
      message:
        '1. Ouvre la page  / 2. Clique sur "Demandez identifiant et mot de passe" / 3.  Entre ton nom et prénom.',
      buttons: [
        { text: "Annuler", role: "cancel" },
        {
          text: "Ouvrir la page",
          handler: () => {
            logEvent("askLicense")
            window.open("https://www.telemat.org/FFE/sif/-ident", "_blank")
          },
        },
      ],
    })
  }
  return (
    <IonPage>
      <NavBar leftIcon="back" leftAction={() => history.goBack()} title="Inscription" />

      <IonContent>
        {loading && <Spinner />}
        <Container className="max-width-container" style={{ marginTop: 15 }}>
          <Formik
            initialValues={{ licenseNumber: authUser?.licenseNumber || "" }}
            validationSchema={formSchema}
            validateOnBlur={false}
            onSubmit={handleSubmit}
          >
            {(props) => {
              const { errors, touched, isSubmitting, values } = props

              return (
                <Form>
                  <Title2>Es-tu dans la liste ? 😎</Title2>
                  <Text2 style={{ marginBottom: 9 }}>{currentChallenge.audience.whitelistMessage}</Text2>

                  <FormikFieldContainer
                    autoFocus
                    // value='1234567'
                    type="text"
                    name="licenseNumber"
                    placeholder="Numéro de licence"
                  />
                  <ErrorLabel>{authError}</ErrorLabel>
                  <Button
                    type="submit"
                    disabled={!values.licenseNumber || isSubmitting}
                    className="ion-margin-vertical"
                  >
                    S'inscrire
                  </Button>
                </Form>
              )
            }}
          </Formik>

          <RegularLink onClick={handleLicenseUnknown}>Je ne connais pas mon numéro de licence </RegularLink>
          {!authUser && (
            <RegularLink
              data-test="button-login"
              onClick={() => {
                history.push(ROUTES.SIGN_UP__EMAILPASSWORD)
              }}
            >
              Déjà inscrit.e au challenge ? Connexion{" "}
            </RegularLink>
          )}
          <HelpLink label="signup-license-check" footer={"Numéro de licence : " + (licenseNumber || "non défini")} />
        </Container>
        {!!openVerificationWithInformations && (
          <SignUpClubLicensePopup
            open={!!openVerificationWithInformations}
            informations={openVerificationWithInformations}
            onClose={() => setOpenVerificationWithInformations(false)}
            onValidLicenseForm={(licenseeUpdate) => goNext(licenseeUpdate)}
          />
        )}
      </IonContent>
    </IonPage>
  )
}
