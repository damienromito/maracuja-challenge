import { PLAYER_ROLES } from "@maracuja/shared/constants"
import React, { useContext, useState } from "react"
import { Button, Modal, PlayerCell, Popup, Text1 } from "../../components"
import { NotificationContext, useApp, useCurrentChallenge } from "../../contexts"
import { currentDate } from "../../utils/helpers"

/// ////////////////// HEADER

export default ({ team, listType = "licensees" }) => {
  const { currentPhase, currentChallenge, currentRanking, currentPlayer } = useCurrentChallenge()
  const [playerToWakeUp, setPlayerToWakeUp] = useState(null)
  const { loading, setLoading, openPopup, logEvent } = useApp()
  const { sendWakeUp } = useContext(NotificationContext)

  const isSelected = (index) => {
    if (!currentChallenge.topPlayersEnabled) return false
    if (
      (listType !== "referees" && index < currentChallenge.topPlayers.members) ||
      (listType === "referees" && index < currentChallenge.topPlayers.referees)
    )
      return true
    return false
  }

  const handleClickWakeUp = ({ playerToWakeUp, alreadyWokeUp, fromReferer }) => {
    logEvent("wakeup_start")
    if (!alreadyWokeUp) {
      setPlayerToWakeUp({ player: playerToWakeUp, fromReferer })
    } else {
      logEvent("wakeup_unavailable")
      const popupInfos = {
        title: "Ce joueur a déjà été réveillé",
        message: `En tant que ${currentChallenge.wording.captain}, tu peux réveiller un joueur qui n'a pas encore joué sur le quiz en cours.`,
        buttonText: "ok",
      }
      openPopup(popupInfos)
    }
  }

  const handleValideWakeUp = async () => {
    setLoading(true)
    await sendWakeUp({ focusedPlayer: playerToWakeUp.player, fromReferer: playerToWakeUp.fromReferer })
    logEvent("wakeup_end")
    playerToWakeUp.notifiedAt = currentDate()
    setPlayerToWakeUp(false)
    setLoading(false)
  }
  const phaseId = currentPhase?.id ?? currentChallenge.getPreviousPhase()?.id
  return (
    <>
      {team
        ?.sortedPlayers({ currentPhaseId: phaseId })
        .filter((player) => {
          if (currentChallenge.referralEnabled) {
            // if (currentPlayer.hasRole(PLAYER_ROLES.REFEREE)) return true
            const isReferee = player.hasRole(PLAYER_ROLES.REFEREE)
            return (listType === "referees" && isReferee) || (listType !== "referees" && !isReferee)
          } else {
            return true
          }
        })
        .map((player, index) => {
          // TODO SCORE
          return (
            <PlayerCell
              key={`player-${player.id}`}
              user={player}
              team={team}
              isAuthorized={currentRanking?.currentTeamSelected}
              isCurrentUser={player.id === currentPlayer.id}
              isSelected={isSelected(index)}
              onClickWakeUp={handleClickWakeUp}
              phaseId={phaseId}
            />
          )
        })}
      {playerToWakeUp && (
        <Modal closeButton onClose={() => setPlayerToWakeUp(null)} isOpen={!!playerToWakeUp} title="Debout !">
          <Text1>
            {currentPlayer.username}
            {!playerToWakeUp.fromReferer
              ? `, en tant que ${currentChallenge.wording.captain}, tu as le pouvoir de reveiller ${
                  playerToWakeUp.player.username || playerToWakeUp.player.firstName
                } qui n'a pas encore joué ! 📣`
              : `, en tant que parrain, tu as le pouvoir de reveiller ${
                  playerToWakeUp.player.username || playerToWakeUp.player.firstName
                } qui n'a pas encore joué ! 📣`}
          </Text1>
          <br />
          <Button onClick={handleValideWakeUp} disabled={loading}>
            Envoyer une notif
          </Button>
        </Modal>
      )}
    </>
  )
}
