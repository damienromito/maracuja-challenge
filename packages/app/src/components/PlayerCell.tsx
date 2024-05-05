import { IonModal } from "@ionic/react"
import { ROLES } from "@maracuja/shared/constants"
import { capitalizeFirstLetter } from "@maracuja/shared/helpers"
import React, { useMemo, useState } from "react"
import { useHistory } from "react-router-dom"
import styled from "styled-components"
import { Button, QuestionSetIcon } from "."
import ROUTES from "../constants/routes"
import { useApp, useCurrentChallenge } from "../contexts"
import Badge from "./Badge"
import Container from "./Container"
import PhaseQuestionSets from "./PhaseQuestionSets"
import PlayerCardViewer from "./PlayerCardViewer"
import PlayerIcon from "./PlayerIcon"
import PlayerListItem from "./PlayerListItem"
import PlayerWeekQuestionSets from "./PlayerWeekQuestionSets"

export default ({
  user,
  isCurrentUser = false,
  onClickWakeUp = undefined,
  isSelected = false,
  isAuthorized = false,
  preview = false,
  team = undefined,
  phaseId = false,
}) => {
  const { currentQuestionSet, currentPlayer, currentChallenge } = useCurrentChallenge()
  const history = useHistory()
  const [showCardPreview, setShowCardPreview] = useState<any>(false)

  let playerCanBeWokeUp, alreadyWokeUp, userCurrentQuestionSet, refererCanWakeUp, alreadyPlayed
  if (!preview && currentQuestionSet && currentQuestionSet.phase?.id === phaseId) {
    userCurrentQuestionSet = {
      ...user.questionSets?.[currentQuestionSet.id],
      type: currentQuestionSet.type,
    }
    playerCanBeWokeUp = !isCurrentUser && isAuthorized
    if (playerCanBeWokeUp) {
      refererCanWakeUp = user.roles?.includes(ROLES.REFEREE) && user.referer && user.referer.id === currentPlayer.id
      const captainCanWakeUp =
        currentPlayer?.hasRole(ROLES.CAPTAIN) && (!user.roles || !user.roles?.includes(ROLES.REFEREE))
      playerCanBeWokeUp = (captainCanWakeUp || refererCanWakeUp) && user.acceptNotification
    }
    alreadyPlayed = !!userCurrentQuestionSet?._stats?.count
    alreadyWokeUp = !!userCurrentQuestionSet?.wokeUpAt
  }

  const isPlayerReferee = currentPlayer ? (user.referer && user.referer.id) === currentPlayer.id : false
  const isPlayerReferer = currentPlayer?.hasRole(ROLES.REFEREE)
    ? (currentPlayer.referer && currentPlayer.referer.id) === user.id
    : false

  const titleDetail = useMemo(() => {
    let title = null
    if (user.referer) {
      title = `${capitalizeFirstLetter(currentChallenge.wording.referee)} de ${user.referer.username}`
    } else if (user.roles?.includes(ROLES.CAPTAIN)) {
      title = capitalizeFirstLetter(currentChallenge.wording.captain)
    }
    return title
  }, [])

  const handleClickCell = () => {
    if (preview) return

    if (!currentPlayer.avatar && isCurrentUser) {
      history.push(ROUTES.EDIT_CURRENT_PLAYER + "/photo")
    } else {
      setShowCardPreview(true)
    }
  }

  return (
    <PlayerListItem
      key={user.id}
      onClickItem={handleClickCell}
      className={isCurrentUser || isPlayerReferee || isPlayerReferer ? "activeUser" : ""}
      playerIcon={
        <PlayerIcon
          role={user.roles?.[0]}
          number={!!user.avatar && user.number}
          isInTopPlayers={currentChallenge.topPlayersEnabled && isSelected}
        />
      }
      title={user.username}
      titleDetail={titleDetail}
      subTitle={
        !preview && (
          <>
            {currentChallenge.team.displayOnlyCurrentWeek ? (
              <PlayerWeekQuestionSets user={user} />
            ) : (
              <PhaseQuestionSets user={user} />
            )}

            {user.refereeCount && (
              <Badge green>
                {user.refereeCount} {currentChallenge.wording.referee}
                {user.refereeCount > 1 ? "s" : ""}
              </Badge>
            )}
          </>
        )
      }
      rightContent={
        !preview && (
          <>
            {alreadyPlayed ? (
              <QuestionSetIcon questionSet={userCurrentQuestionSet} style={{ width: 60 }} size={40} />
            ) : (
              playerCanBeWokeUp && (
                <WakeUpButton
                  onClick={() =>
                    onClickWakeUp({
                      playerToWakeUp: user,
                      alreadyWokeUp,
                      fromReferer: refererCanWakeUp,
                    })
                  }
                  className={`${alreadyWokeUp ? "disabled" : ""} icon icon-megaphone `}
                >
                  Debout !
                </WakeUpButton>
              )
            )}
          </>
        )
      }
    >
      <PlayerCardPopup
        preview={preview}
        user={user}
        team={team}
        phaseId={phaseId}
        setShowCardPreview={setShowCardPreview}
        showCardPreview={showCardPreview}
      />
    </PlayerListItem>
  )
}

const PlayerCardPopup = ({ preview, team, user, setShowCardPreview, showCardPreview, phaseId }) => {
  const { logEvent } = useApp()
  const { currentPlayer, currentTeam } = useCurrentChallenge()

  const handleClosePopupMessage = () => {
    setShowCardPreview(false)
    logEvent("displayPlayerCardUnavailable")
  }

  const handleClickPopupButton = ({ currentTarget, currentPlayer }) => {
    setShowCardPreview(false)
    logEvent(currentTarget.id === currentPlayer.id ? "displayPlayerCardSelf" : "displayPlayerCard")
  }

  return !preview && user.avatar ? (
    <IonModal isOpen={showCardPreview}>
      <PlayerCardViewer
        popup
        onClickPopupButton={() =>
          handleClickPopupButton({
            // currentTeam: team,
            currentTarget: user,
            currentPlayer: currentPlayer,
          })
        }
        team={team}
        phaseId={phaseId}
        player={user}
      />
    </IonModal>
  ) : (
    <IonModal isOpen={showCardPreview}>
      <PopupMessageStyle>
        <div className="message">
          <Container>
            <h1>{user.username} n'a pas encore créé(e) sa carte</h1>
            <p>
              Tu peux consulter la carte d’un coéquipier lorsqu’il a ajouté sa photo. Son numéro s’affiche alors sur son
              maillot dans l’équipe.
            </p>
            <Button
              button
              onClick={
                () => handleClosePopupMessage()
                // {
                // currentTeam: currentTeam,
                // currentTarget: user,
                // currentPlayer: currentPlayer,
                // }
              }
              primary
            >
              Ok
            </Button>
          </Container>
        </div>
      </PopupMessageStyle>
    </IonModal>
  )
}

const WakeUpButton = styled(Button)`
  width: 62px;
  margin-left: 6px;
  &.icon:before {
    font-size: 50px;
    margin: 6px 0 0 0;
    position: absolute;
  }
  span {
    transform: rotate(7deg);
    font-family: "Chelsea Market", Courier;
    font-size: 9px;
    text-transform: initial;
    position: relative;
    margin-top: -32px;
    display: block;
    margin-left: 3px;
    padding: 5px 0;
  }
`

const PopupMessageStyle = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  width: 100vw;
  z-index: 1;

  .message {
    position: relative;
    width: 358px;
    background: #ffffff;
    border-radius: 13px;

    h1 {
      font-family: "Open Sans";
      font-weight: bold;
      font-size: 18px;
      line-height: 20px;
      color: #000000;
      margin-top: 15px;
    }
    p {
      font-family: "Open Sans";
      font-size: 19px;
      line-height: 26px;
      color: #000000;
      margin-top: 15px;
    }

    Button {
      margin-top: 15px;
      width: 115px;
    }
  }
`
