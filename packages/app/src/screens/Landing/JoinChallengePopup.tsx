import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import {
  Button, Modal, Text2, Title3
} from '../../components'
import ROUTES from '../../constants/routes'
import { useAuthUser, useCurrentChallenge } from '../../contexts'
import { signupRouteForAudience } from '../../utils/helpers'

export default ({ isOpen, onClose }) => {
  const { currentChallenge, currentPhase } = useCurrentChallenge()
  const history = useHistory()

  const { authUser } = useAuthUser()

  const handleClickLogin = () => {
    history.push(ROUTES.SIGN_UP__EMAILPASSWORD)
  }

  const handleClickSignup = () => {
    onClose()
    const signupRoute = signupRouteForAudience(currentChallenge.audience)
    history.push(signupRoute)
  }

  return (
    <Modal
      isOpen={isOpen} onClose={onClose}
      closeButton
    >
      {!authUser &&
        <>
          <LoginLink onClick={handleClickLogin} data-test='button-login'>Déjà inscrit.e au challenge ? Connexion</LoginLink>
          <br /><br />
        </>}
      <Title3>Pas inscrit.e au challenge ?</Title3>
      {currentChallenge?.onboarding?.joinPopup?.buttonDescriptionText &&
        <Text2>{currentChallenge.onboarding.joinPopup.buttonDescriptionText}</Text2>}

      {currentPhase?.signupDisabled &&
        <p>🚫 Inscriptions fermées ({currentPhase.name} en cours)</p>}
      <Button onClick={handleClickSignup} data-test='button-signup' disabled={currentPhase?.signupDisabled}>{currentChallenge.onboarding?.joinPopup?.buttonText || "S'inscrire au challenge"}</Button>
      <br />

      {currentChallenge.referralEnabled &&
        <>
          <Text2>{currentChallenge.referral.onboarding.joinPopup.buttonDescriptionText}</Text2>
          <Button secondary onClick={() => history.push(ROUTES.SIGN_UP_REFERRAL)}>{currentChallenge.referral.onboarding.joinPopup.buttonText}</Button>
        </>}
      {/* <Text2><strong>Tu n’as pas de numéro de licence ?</strong> Tu peux quand même rejoindre {currentChallenge.wording.theTribe} en tant que “supporter“ si l’un des {currentChallenge.wording.players} t’a donné <strong>son code de parrainage !</strong></Text2>
      <Button secondary onClick={() => history.push(ROUTES.SIGN_UP_REFERRAL)}>S'INSCRIRE AVEC UN CODE DE PARRAINAGE</Button> */}
    </Modal>
  )
}

const LoginLink = styled.a`
  text-decoration : underline;
  padding-top: 5px;
  display: inline-block;
`
