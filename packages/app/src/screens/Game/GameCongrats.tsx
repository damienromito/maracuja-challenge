import { ACTIVITY_TYPES } from "@maracuja/shared/constants"
import ROLES from "@maracuja/shared/constants/roles"
import { Game, Icebreaker } from "@maracuja/shared/models"
import React, { useContext, useEffect, useState } from "react"
import { useNetworkStatus } from "react-adaptive-hooks/network"
import { generatePath, useHistory } from "react-router-dom"
import styled from "styled-components"
import {
  Button,
  Container,
  DebriefingIcon,
  Popup,
  RadialContainer,
  RegularLink,
  Spinner,
  Text2,
  Text3,
  Title1,
  Title3,
  TitleDate,
  TrainingIcon,
  ContestIcon,
  Modal,
} from "../../components"
import ROUTES from "../../constants/routes"
import { GameContext, useApp, useCurrentChallenge } from "../../contexts"

const TEST_MODE = false
let unsusbcribeBlockGoBack = null
let game

export default () => {
  const { currentQuestionSets, currentPlayer, currentChallenge, currentActivities } = useCurrentChallenge()
  const { effectiveConnectionType } = useNetworkStatus()
  const { questionSet, disableSendingGame, sendingGame, removeSendingGame, setDisableSendingGame, reset } =
    useContext(GameContext)
  const { logEvent, loading, setLoading } = useApp()

  const history = useHistory()

  const [isSubmiting, setIsSubmiting] = useState(true)
  const [showPopupRetry, setShowPopupRetry] = useState(false)

  useEffect(() => {
    if (sendingGame !== null) {
      saveGame()
    }
  }, [sendingGame])

  const saveGame = () => {
    if (!unsusbcribeBlockGoBack) {
      unsusbcribeBlockGoBack = createAvoidGoBack()
    }

    if (sendingGame) {
      game = sendingGame
    } else {
      alert("Ta partie a déjà été enregistrée.")
      localStorage.removeItem("savedStates")
      goNext()
      return
    }

    if (!TEST_MODE && !disableSendingGame) {
      setLoading(false)
      if (game.questionSet.type !== ACTIVITY_TYPES.CONTEST) {
        createGame(game)
      } else {
        const currentQuestionSet = currentQuestionSets.find((item) => item.id === game.questionSet.id)
        if (
          currentQuestionSet?.id === game.questionSet.id &&
          !(currentQuestionSet.type !== ACTIVITY_TYPES.TRAINING && currentQuestionSet.hasPlayed)
        ) {
          createGame(game)
        } else {
          gameSent()
        }
      }
    } else {
      gameSent()
    }
  }

  const createGame = async (game) => {
    setIsSubmiting(true)
    setDisableSendingGame(true)
    console.log("Game sending...", game)
    try {
      console.log("game:", game)
      if (game.questionSet.type === ACTIVITY_TYPES.ICEBREAKER) {
        await Icebreaker.create(game)
      } else {
        const result = await Game.create(game)
        console.log(">>>game saved", result)
      }
      gameSent()
    } catch (error) {
      setDisableSendingGame(false)
      setShowPopupRetry(true)
      setLoading(false)
      setIsSubmiting(false)
      console.log(error)
      logEvent("game_exit_error", {
        label: JSON.stringify(error),
      })
    }
    logEvent("game_end")
  }

  const gameSent = () => {
    console.log("GAME SENT")
    localStorage.removeItem("savedStates")
    removeSendingGame()
    setIsSubmiting(false)
  }

  const createAvoidGoBack = () => {
    function goForward() {
      history.go(1)
    }
    window.addEventListener("popstate", goForward)
    return () => {
      window.removeEventListener("popstate", goForward)
    }
  }

  const killAvoidGoBack = () => {
    unsusbcribeBlockGoBack()
    unsusbcribeBlockGoBack = null
  }

  // THIS USEEFFECT permet de donner l'impression que le chargement est rapide : le temps de lire la page, en general le chargement est deja fait. Si ce n'est pas le cas, on garde la page en chargement si l'user appui sur ok à ce moment là
  useEffect(() => {
    checkIsSubmited()
  }, [isSubmiting])

  const checkIsSubmited = () => {
    if (!isSubmiting && loading) {
      goNext()
    }
  }

  const onClickClose = () => {
    if (isSubmiting) {
      setLoading(true)
    } else {
      goNext()
    }
  }

  const goNext = () => {
    setLoading(false)
    unsusbcribeBlockGoBack && killAvoidGoBack()
    history.push(ROUTES.HOME)
  }

  const handleClickSendRetry = () => {
    createGame(game)
    setShowPopupRetry(false)
  }

  const handleClickCreateQuestion = () => {
    unsusbcribeBlockGoBack && killAvoidGoBack()
    history.push(generatePath(ROUTES.ICEBREAKER_CREATE_QUESTION))
  }

  const handleClickContinue = () => {
    console.log("isSubmit", isSubmiting)
    setDisableSendingGame(false)
    unsusbcribeBlockGoBack && killAvoidGoBack()
    reset()
    history.push(`/${game.questionSet.type}s/${game.questionSet.id}/intro`, {
      keepProgression: true,
    })
  }

  return game ? (
    <CongratsContainer>
      {game.questionSet.type !== ACTIVITY_TYPES.CONTEST ? (
        <>
          <Container>
            <Title1>
              {game.correctCount >= game.questionCount
                ? "Parfait " + game.player.username + " ! 😎"
                : "Bel effort " + game.player.username + " ! "}
            </Title1>
          </Container>
          <Container className="max-width-container">
            {game.questionSet.type === ACTIVITY_TYPES.ICEBREAKER && (
              <>
                <Title3>
                  {game.correctCount >= game.questionCount
                    ? `Tu connais tes coéquipiers à ${Math.round((game.correctCount / game.questionCount) * 100) + "%"}`
                    : "Réessaie pour améliorer ton score"}
                </Title3>
              </>
            )}
            {game.questionSet.type === ACTIVITY_TYPES.TRAINING && (
              <Title3>
                {game.correctCount >= game.questionCount
                  ? "Tu as complété ton entrainement, te voilà mieux préparé.e pour la compétition !"
                  : "Si tu ne te sens pas encore prêt.e, tu peux t'entrainer à nouveau pour compléter ton entrainement. "}
              </Title3>
            )}
            {game.questionSet.type === ACTIVITY_TYPES.DEBRIEFING && (
              <Title3>
                {game.correctCount >= game.questionCount
                  ? "Tu as complété ton debriefing, te voilà mieux préparé.e pour la compétition !"
                  : "Si tu ne te sens pas encore prêt.e, tu peux debriefer à nouveau tes erreurs. "}
              </Title3>
            )}
          </Container>

          {game.questionSet.type === ACTIVITY_TYPES.DEBRIEFING ? (
            <DebriefingIcon progression={game.progression} large />
          ) : (
            <TrainingIcon progression={game.progression} large />
          )}

          <Container>
            <Title3 style={{ marginTop: 10 }}>{game.questionSet.name}</Title3>
            <TitleDate style={{ marginTop: 10 }}>{Math.round(game.progression * 100) + "%"} complété</TitleDate>
          </Container>
        </>
      ) : (
        <>
          <div style={{ paddingTop: "15px" }} className="max-width-container">
            {game.endOfTime && <Text2>⏰ Temps maximum atteint</Text2>}
            {game.answerCount === game.questionCount && <Text2 center>Tu as répondu à toutes les questions ! 💪🏻</Text2>}
            {currentPlayer.hasRole(ROLES.REFEREE) &&
              questionSet.type !== ACTIVITY_TYPES.TRAINING &&
              game.correctCount >= 5 && <Text2>5 points : tu as rempli ta mission de filleul.e !</Text2>}
          </div>
          <Title1>
            {game.correctCount > 0
              ? "Bravo " + game.player.username + " 🔥"
              : `${currentChallenge.wording.zeroPointMessage || "C'est pas terrible ça"} ${game.player.username} ! 😕`}
          </Title1>

          <Container>
            <Title3>
              Tu as obtenu {game.correctCount} points à l'épreuve {game.questionSet.name} !
            </Title3>
          </Container>

          <Container>
            <ContestIcon score={game.correctCount} large />

            <Title3 style={{ marginTop: 10 }}>{game.questionSet.name}</Title3>
            <TitleDate style={{ marginTop: 10 }}> {game.correctCount} POINTS</TitleDate>
          </Container>
        </>
      )}

      <Container>
        {isSubmiting ? (
          <LoadingMessage>Envoi en cours...</LoadingMessage>
        ) : (
          <>
            {questionSet.type === ACTIVITY_TYPES.CONTEST && (
              <Button data-test="button-ok" onClick={() => onClickClose()}>
                Ok
              </Button>
            )}

            {questionSet.type === ACTIVITY_TYPES.TRAINING && (
              <>
                {game.progression < 1 ? (
                  <>
                    <Button onClick={handleClickContinue}>Continuer l'entrainement</Button>
                    <RegularLink onClick={() => onClickClose()}>Passer</RegularLink>
                  </>
                ) : (
                  <Button data-test="button-ok" onClick={() => onClickClose()}>
                    Ok
                  </Button>
                )}
              </>
            )}

            {questionSet.type === ACTIVITY_TYPES.DEBRIEFING && (
              <>
                {game.progression < 1 ? (
                  <>
                    <Button onClick={handleClickContinue}>Continuer le débriefing</Button>
                    <RegularLink onClick={() => onClickClose()}>Passer</RegularLink>
                  </>
                ) : (
                  <Button data-test="button-ok" onClick={() => onClickClose()}>
                    Ok
                  </Button>
                )}
              </>
            )}

            {questionSet.type === ACTIVITY_TYPES.ICEBREAKER && (
              <>
                {!currentPlayer.icebreaker?.questionCreationCount && (
                  <>
                    <Button onClick={handleClickCreateQuestion}>Crée ta question</Button> <br />
                  </>
                )}

                {game.progression < 1 ? (
                  <>
                    <Button onClick={handleClickContinue}>Rejouer</Button>
                    <RegularLink onClick={() => onClickClose()}>Passer</RegularLink>
                  </>
                ) : (
                  <Button data-test="button-ok" onClick={() => onClickClose()}>
                    Ok
                  </Button>
                )}
              </>
            )}
          </>
        )}
      </Container>

      {showPopupRetry && (
        <Modal isOpen={showPopupRetry} title="Ta partie n'a pas été envoyée.">
          <Text2>Vérifie ta connexion internet avant de réessayer.</Text2>
          <Text3>Connexion actuelle : {effectiveConnectionType}</Text3>
          <Button onClick={handleClickSendRetry}>Réessayer</Button>
          <RegularLink
            lightBg
            onClick={() => {
              setShowPopupRetry(false)
              goNext()
            }}
          >
            Annuler
          </RegularLink>
        </Modal>
      )}
    </CongratsContainer>
  ) : (
    <Spinner />
  )
}

const LoadingMessage = styled.p`
  text-align: center;
  text-align: center;
  margin: 10px 0;
  position: fixed;
  bottom: 0;
  width: 100%;
  color: ${(props) => props.theme.text.tertiary};
`

const CongratsContainer = styled(RadialContainer)`
  text-align: center;
  justify-content: space-evenly;
`
