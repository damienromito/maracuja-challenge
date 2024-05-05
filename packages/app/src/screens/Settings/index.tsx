import { IonContent, IonPage, useIonActionSheet } from "@ionic/react"
import React from "react"
import { CellButton, Container, HelpLink, NavBar, Text3, Text4 } from "../../components"
import ROUTES from "../../constants/routes"
import { useApp, useAuthUser, useCurrentChallenge } from "../../contexts"
import useSuggestion from "../../hooks/useSuggestion"

const Settings = ({ history }) => {
  const [present] = useIonActionSheet()

  const { setCurrentChallengeById, currentChallenge, currentTeam, getChallengesHistory } = useCurrentChallenge()
  const { onSignOut, authUser } = useAuthUser()
  const { openAlert } = useApp()
  const { hiddenSuggestions } = useSuggestion()

  const handleClickRoute = (route) => {
    history.push(route)
  }

  const onClickHelp = () => {
    history.push(ROUTES.CHALLENGE_RULES)
  }

  const onClickSignOut = () => {
    if (window.confirm("Se deconnecter ?") === true) {
      onSignOut().then(() => {
        history.push(ROUTES.HOME)
      })
    }
  }

  const handleExit = () => {
    if (window.confirm("Quitter ce challenge ?") === true) {
      switchChallenge(null)
    }
  }

  const switchChallenge = (id) => {
    setCurrentChallengeById(id)
    history.push(ROUTES.HOME)
  }

  const handleSwitchChallenge = () => {
    const challenges = getChallengesHistory()
    if (challenges.length < 1) {
      handleExit()
    } else {
      const buttons = challenges.map((c) => {
        return { text: `${c.name} (${c.code || ""})`, handler: () => switchChallenge(c.id) }
      })
      buttons.push({ text: "Rejoindre un autre challenge", handler: () => switchChallenge(null), role: "destructive" })
      buttons.push({ text: "Annuler", role: "cancel" })
      present({ buttons, header: "MES CHALLENGES" })
    }
  }

  const handleResetSuggestions = () => {
    openAlert({
      title: "Reinitialiser les suggestion",
      message: "Cela affichera les suggestions qui ont été masquée sur la page vestiaire",
      buttons: [
        "Annuler",
        {
          text: "OK",
          handler: () => {
            localStorage.removeItem("hiddenSuggestions")
            history.push(ROUTES.HOME)
            window.location.reload()
          },
        },
      ],
    })
  }

  return (
    authUser && (
      <IonPage>
        <NavBar title="Paramètres" leftAction={() => history.goBack()} leftIcon="back" />
        <IonContent>
          <Container>
            <Text3 style={{ marginBottom: 10 }}>Tu es inscrit avec {authUser.phoneNumber || authUser.email}</Text3>

            <HelpLink label="settings">☝️ J'ai besoin d'aide</HelpLink>
            <br />
            {currentChallenge && currentTeam && (
              <>
                <CellButton onClick={() => handleClickRoute(ROUTES.EDIT_CURRENT_PLAYER)}>
                  Modifier mon profil joueur
                </CellButton>
                <CellButton onClick={onClickHelp}>FAQ</CellButton>
                {hiddenSuggestions && Object.keys(hiddenSuggestions).length > 0 && (
                  <CellButton onClick={handleResetSuggestions}>Re-afficher les suggestions masquées</CellButton>
                )}
                {/* <CellButton href={`mailto:bonjour@maracuja.ac?subject=Maracuja, j'ai une question&body=Nom ${currentChallenge.wording.tribeOfThe || 'du club'}  :${currentPlayer.club.name} ${authUser.licenseNumber || currentPlayer.id}`}>
                J'ai besoin d'aide
              </CellButton> */}
                {currentChallenge.cguLink && (
                  <CellButton href={currentChallenge.cguLink}>Conditions générales d'utilisation</CellButton>
                )}
                {currentChallenge.privacyLink && (
                  <CellButton href={currentChallenge.privacyLink}>Politique de confidentialité</CellButton>
                )}
                <CellButton onClick={handleSwitchChallenge}>Changer de challenge</CellButton>
              </>
            )}
            {/* <CellButton onClick={handleClickReload}>
            Rafraichir l'app
          </CellButton> */}
            <CellButton onClick={onClickSignOut}>Se déconnecter</CellButton>
            <Text4>Version : {process.env.REACT_APP_VERSION} </Text4>
          </Container>
        </IonContent>
      </IonPage>
    )
  )
}

export default Settings
