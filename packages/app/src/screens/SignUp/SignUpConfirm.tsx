import { IonContent, IonPage } from "@ionic/react"
import { objectSubset } from "@maracuja/shared/helpers"
import React, { useContext, useEffect, useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import styled from "styled-components"
import { Player, User } from "@maracuja/shared/models"
import { Button, Modal, Popup, Spinner, Text2 } from "../../components"
import ROUTES from "../../constants/routes"
import {
  NotificationContext,
  useApi,
  useApp,
  useAuthUser,
  useCurrentChallenge,
  useCurrentOrganisation,
  useDevice,
} from "../../contexts"
import { signupRouteForAudience } from "../../utils/helpers"

let handleAuthStarted = false

export default () => {
  const { authUserId, authUser, onSignOut } = useAuthUser()
  const { currentChallenge, currentPhase } = useCurrentChallenge()
  const { fcmToken, platform } = useContext(NotificationContext)
  const { currentOrganisation } = useCurrentOrganisation()

  const { deviceId, appVersion } = useDevice()
  const api = useApi()
  const { logEvent, openAlert } = useApp()
  const history = useHistory()
  const location = useLocation<any>()

  const [alreadySubscribedPopupOpened, setAlreadySubscribedPopupOpened] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notSubscribePopupOpened, setNotSubscribedPopupOpened] = useState(false)

  useEffect(() => {
    if (authUser && !handleAuthStarted) {
      console.log("authUser", authUser)
      handleAuth()
    }
  }, [authUser])

  const handleAuth = async () => {
    handleAuthStarted = true

    if (location.state.user?.isNew) {
      /** * NOT IN AUTH DB ****/
      // CREATE USER
      if (currentChallenge.verifyEmail) {
        await User.doSendEmailVerification(`https://${currentOrganisation?.dynamicLinkHost}/email-verified`)
      }
      await subscribePlayerInChallenge(true)
    } else {
      /** ** USER EXISTS IN AUTH DB ***/

      const playerData = await Player.fetch({ challengeId: currentChallenge.id, id: authUserId })
      if (playerData) {
        /** PLAYER IN challenge **/
        if (location.state.user?.isNew) {
          setAlreadySubscribedPopupOpened(true)
          setLoading(false)
        } else {
          history.push(ROUTES.CHALLENGE)
        }
      } else {
        /** user NOT in challenge **/
        await subscribePlayerInChallenge()
      }
      // setLoading(false)
    }
    handleAuthStarted = false
  }

  const subscribePlayerInChallenge = async (isNew = false) => {
    if (currentPhase?.signupDisabled) {
      setLoading(false)
      alert(
        `🚫 Sorry... Les inscriptions sont fermées (${currentPhase.name} en cours) et tu n'es pas encore inscrit.e au challenge... 😞 A très vite pour un nouveau challenge !`
      )
      await onSignOut()
      history.push(ROUTES.HOME)
      return
    }

    // FROM SIGNUP
    if (location.state.user.username && location.state.club) {
      const params = {
        userId: authUser.id,
        ...objectSubset(authUser, ["avatar", "birthday"]),
        ...objectSubset(location.state.user, [
          "email",
          "roles",
          "username",
          "firstName",
          "lastName",
          "optinRole",
          "phoneNumber",
          "isNew",
          "birthday",
          "licenseNumber",
          "updatedLicenseInfo",
          "createdAtInWhitelist",
          "referer",
        ]),
        club: objectSubset(location.state.club, ["id", "name", "image"]),
        challengeId: currentChallenge.id,
        mailjetListId: !currentChallenge.optinMandatory ? currentChallenge.mailjetListId : null,
        currentPhaseId: currentPhase?.id,
        // publicIp,
        deviceId,
        fcmToken,
        platform,
        questionSetEngagment: { possibleParticipationCount: currentChallenge.getPossibleQuestionSetCount() },
        appVersion: { build: process.env.REACT_APP_VERSION, version: appVersion },
      }

      const response = await Player.create(params)

      if (response.warning) {
        setLoading(false)
        if (response.warning.code === "anti-cheat/forbidden") {
          openAlert({ message: response.warning.message, title: response.warning.title })
          handleExit()
          return
        } else {
          alert(response.warning.title + "\r\n" + response.warning.message)
        }
      }

      isNew && logEvent("user_new")
      logEvent("player_new")
      // setTimeout(() => {
      // }, 10000)
      history.push(ROUTES.ONBOARDING_WELCOME)

      // FROM SIGNIN
    } else {
      setNotSubscribedPopupOpened(true)
      setLoading(false)
    }
    return true
  }

  const handleClickSignup = () => {
    const signupRoute = signupRouteForAudience(currentChallenge.audience)
    history.push(signupRoute, location.state)
  }
  const handleExit = () => {
    onSignOut()
    history.push(ROUTES.HOME)
  }

  return (
    <IonPage>
      <ConfirmationContainer>
        {loading && <Spinner />}
        <br />
        <br />
        <p className="loading">Connexion en cours</p>
        <Modal
          isOpen={notSubscribePopupOpened}
          title="Pas encore inscrit ?"
          onClose={() => {
            onSignOut()
            history.push(ROUTES.CHALLENGE)
          }}
          closeButton
        >
          <p className="center">Tu n'es pas encore inscrit au challenge "{currentChallenge.name}"</p>
          <Button onClick={handleClickSignup}>S'inscrire au challenge</Button>
          {location.state?.user?.isNew && (
            <>
              {/* <CGU>En m'inscrivant, j’accepte les <Link to={{pathname:ROUTES.CGU}} >conditions générales d’utilisation</Link> et notre <Link to={{pathname:ROUTES.PRIVACY}} >politique de confidentialité</Link>.</CGU> */}
              <CGU>
                En m'inscrivant, j’accepte les{" "}
                <a href="https://www.maracuja-academy.com/cgu" target="_blank" rel="noreferrer">
                  conditions générales d’utilisation
                </a>{" "}
                et notre{" "}
                <a href="https://www.maracuja-academy.com/privacy" target="_blank" rel="noreferrer">
                  politique de confidentialité
                </a>
                .
              </CGU>
            </>
          )}
        </Modal>
        <Modal isOpen={alreadySubscribedPopupOpened} onClose={handleExit} closeButton>
          <p className="center">Tu es déjà inscrit.e au challenge !</p>
          <Button onClick={() => history.push(ROUTES.CHALLENGE)}>Se connecter</Button>
        </Modal>
      </ConfirmationContainer>
    </IonPage>
  )
}

const ConfirmationContainer = styled(IonContent)`
  p.loading {
    text-align: center;
    text-align: center;
    margin: 30px;
    color: ${(props) => props.theme.text.tertiary};
  }
`
const CGU = styled(Text2)`
  line-height: 25px;
  margin: 15px 10px;
  a {
    text-decoration: underline;
  }
`
