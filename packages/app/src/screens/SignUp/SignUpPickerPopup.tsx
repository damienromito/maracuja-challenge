import { useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
// import { useHistory } from 'react-router-dom';
import styled from "styled-components"
import { Button, Modal, Popup, Text2 } from "../../components"
import ROUTES from "../../constants/routes"
import { useAuthUser, useCurrentChallenge, useDevice } from "../../contexts"
import { currentDate } from "../../utils/helpers"

const CGU = styled(Text2)`
  line-height: 25px;
  font-size: 14px;
  a {
    text-decoration: underline;
  }
`

const LoginLink = styled.a`
  text-decoration: underline;
  padding-top: 5px;
  display: block;
  text-align: center;
`

const PopupContainer = styled.div`
  * + * {
    margin-top: 15px;
  }
`

const SignUpPickerPopup = ({ open, onClose }) => {
  const { authUser, onSignOut } = useAuthUser()
  const { currentChallenge } = useCurrentChallenge()
  const { platform } = useDevice()
  const history = useHistory()
  const location = useLocation<any>()

  const state = JSON.parse(localStorage.getItem("authStates")) || location.state

  const [isSigningUp, setIsSigningUp] = useState(state || false)

  const isModifyingAuth = isSigningUp && authUser && localStorage.getItem("authStates")

  const handleSignUp = (route) => {
    if (location.state && !localStorage.getItem("authStates")) {
      localStorage.setItem("authStates", JSON.stringify(location.state))
    }
    if (isSigningUp && authUser && localStorage.getItem("authStates")) {
      authUser
        .detele()
        .then(() => {
          onSignOut().then(() => {
            if (state.user.birthday) {
              state.user.birthday = currentDate(state.user.birthday)
            }
            history.push(route, state)
          })
        })
        .catch((err) => {})
    } else {
      history.push(route, state)
    }
  }

  return (
    <Modal isOpen={open} onClose={onClose} closeButton title={isSigningUp ? "Inscription" : "Connexion"}>
      <PopupContainer>
        <p>
          {isSigningUp ? "Crée ton profil" : "Connecte-toi"} pour rejoindre ton équipe et participer aux challenges
          Maracuja.
        </p>
        {currentChallenge.emailAuthLink ? (
          <Button onClick={() => handleSignUp(ROUTES.SIGN_UP__EMAILLINK)}>Avec ton email Link</Button>
        ) : (
          <Button
            onClick={() => {
              handleSignUp(ROUTES.SIGN_UP__EMAILPASSWORD)
            }}
          >
            Avec ton email
          </Button>
        )}
        {currentChallenge.facebookAuth && (
          <Button onClick={() => handleSignUp(ROUTES.SIGN_UP__FACEBOOK)} ion-margin>
            Avec Facebook
          </Button>
        )}
        {platform !== "ios" &&
          (currentChallenge.phoneAuth || (!currentChallenge.phoneAuth && !isSigningUp) || isModifyingAuth) && (
            <Button onClick={() => handleSignUp(ROUTES.SIGN_UP__PHONE)}>Avec ton téléphone</Button>
          )}
        {isSigningUp ? (
          <>
            <CGU>
              En continuant, j’accepte les{" "}
              <a href="https://www.maracuja-academy.com/cgu" target="_blank" rel="noreferrer">
                conditions générales d’utilisation
              </a>{" "}
              et notre{" "}
              <a href="https://www.maracuja-academy.com/privacy" target="_blank" rel="noreferrer">
                politique de confidentialité
              </a>
              .
            </CGU>
            <LoginLink onClick={() => setIsSigningUp(false)}>Tu as déjà un compte ? Connexion</LoginLink>
          </>
        ) : (
          <LoginLink onClick={() => onClose()}>Tu n’as pas de compte ? Inscription</LoginLink>
        )}
      </PopupContainer>
    </Modal>
  )
}

export default SignUpPickerPopup
