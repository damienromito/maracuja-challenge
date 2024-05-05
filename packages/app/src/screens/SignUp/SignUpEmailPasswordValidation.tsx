import { IonContent, IonPage } from "@ionic/react"
import React, { Fragment, useContext, useEffect, useState } from "react"
import styled from "styled-components"
import { Container, HelpLink, Modal, NavBar, Popup, RegularLink, Spinner, Text2, Title1 } from "../../components"
import ROUTES from "../../constants/routes"
import {
  useAuthUser,
  useApi,
  NotificationContext,
  useCurrentChallenge,
  useDevice,
  useCurrentOrganisation,
} from "../../contexts"
import SignUpPickerPopup from "./SignUpPickerPopup"
import { useInterval } from "../../hooks"
import { checkPlayerHasRequiredChallengeInfo, signupRouteForAudience } from "../../utils/helpers"
import { User } from "@maracuja/shared/models"

// const CGU = styled(Text2)`
//   line-height: 25px;
//   margin: 15px 10px;
//   a{
//     text-decoration: underline
//   }
// `
const PageContainer = styled(Container)`
  padding-top: 30px;
`

// const PasswordField = styled.div`
//   .showButton{
//     float: right;
//     color: ${props => props.theme.primary};
//     position: absolute;
//     font-size: 15px;
//     right: 24px;
//     padding: 38px 15px;
//   }
// `
const SignUpEmailPasswordValidation = ({ history, location }) => {
  const { currentChallenge, currentPlayer } = useCurrentChallenge()
  const api = useApi()
  const { onSignOut, authUser, reloadAuthCurrentUser } = useAuthUser()
  const [waitForResend, setWaitForResend] = useState(false)
  const [open, setOpen] = useState(false)
  const [wantDelete, setWantDelete] = useState(false)
  const [popupSignUpOpened, setPopupSignUpOpened] = useState(false)
  const [loading, setLoading] = useState(false)
  const { currentOrganisation } = useCurrentOrganisation()

  // let checkInterval

  useInterval(() => {
    reloadAuthCurrentUser()
  }, 2000)

  useEffect(() => {
    if (authUser?.emailVerified) {
      if (checkPlayerHasRequiredChallengeInfo(currentPlayer, currentChallenge)) {
        history.push(ROUTES.ONBOARDING_WELCOME)
      } else {
        history.push(ROUTES.SIGN_UP__INFO)
      }
    }
  }, [authUser?.emailVerified])

  const resendEmailValidation = () => {
    return User.doSendEmailVerification(`https://${currentOrganisation?.dynamicLinkHost}/email-verified`)
      .then(() => {
        setWaitForResend(true)
        setOpen(true)
        setTimeout(() => {
          setWaitForResend(false)
        }, 60000)
        // checkInterval = setInterval(checkValidation, 2000)
      })
      .catch(() => {
        setWaitForResend(true)
        setTimeout(() => {
          setWaitForResend(false)
        }, 60000)
      })
  }

  // const doSignOut = () => {
  //   onSignOut().then(() => {
  //     history.push(ROUTES.SIGN_UP_CLUBPICKER)
  //   })
  // }

  const modifyEmail = () => {
    authUser
      .delete()
      .then(() => {
        onSignOut().then(() => {
          // const state = JSON.parse(localStorage.getItem('authStates'))
          // history.push(ROUTES.SIGN_UP__EMAILPASSWORD, state)
          const signupRoute = signupRouteForAudience(currentChallenge.audience)
          history.push(signupRoute, location.state)
        })
      })
      .catch((err) => {
        console.log("err", err)
      })
  }

  return loading || !location.state ? (
    <Spinner />
  ) : (
    <IonPage>
      <NavBar title="Inscription" />
      <IonContent>
        <PageContainer className="max-width-container">
          <Title1>Un e-mail de validation t'a été envoyé !</Title1>
          {/* <br/>
      <Title3>Ton e-mail : <strong>{location.state.email}</strong></Title3> */}
          <Text2 center style={{ margin: "15px 0" }}>
            Tu dois valider ton e-mail pour rejoindre ton {currentChallenge.wording.tribe}. Un lien de connexion a été
            envoyé à l’adresse <strong>{location.state.email}</strong>. Tu le recevras d’ici quelques minutes, sinon
            verifie dans tes spams ou qu'il n'y ai pas d'erreur dans l'adresse email.
          </Text2>
          <>
            <RegularLink
              disabled={waitForResend}
              onClick={() => {
                resendEmailValidation()
              }}
            >
              Me renvoyer un e-mail {waitForResend && " (disponible dans 1 min)"}
            </RegularLink>
            {/* <RegularLink onClick={() => doSignOut()}>Se deconnecter</RegularLink> */}
            <p style={{ textAlign: "center" }}>-</p>
            {currentChallenge.audience.whitelist !== "whitelist" && (
              <RegularLink onClick={() => setWantDelete(true)}>Modifier mon adresse e-mail </RegularLink>
            )}
            <HelpLink label="email-pwd-validation" />
            {/* <RegularLink onClick={() => setPopupSignUpOpened(true)}>Me connecter autrement</RegularLink> */}
            {wantDelete && (
              <Modal
                isOpen={wantDelete}
                closeButton
                onClose={() => setWantDelete(false)}
                title="Tu t'es trompé d'adresse email ? 😱"
                validActionButton={() => modifyEmail()}
                validTextButton="Ok"
              >
                <Text2 center>Clique sur "ok" pour recréer un compte avec ta bonne adresse e-mail !</Text2>
              </Modal>
            )}
          </>

          <SignUpPickerPopup open={popupSignUpOpened} onClose={() => setPopupSignUpOpened(false)} />
        </PageContainer>

        <Modal
          isOpen={open}
          title="Un email de validation t’a été envoyé à nouveau."
          validTextButton="Ok"
          validActionButton={() => setOpen(false)}
        >
          <Text2>Vérifie bien qu'il ne soit pas allé dans tes spams. 🤔</Text2>
        </Modal>
      </IonContent>
    </IonPage>
  )
}

export default SignUpEmailPasswordValidation
