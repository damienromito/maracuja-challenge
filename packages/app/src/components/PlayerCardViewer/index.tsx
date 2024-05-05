import { Button, Title1 } from "@maracuja/shared/components"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import React from "react"
import Avatar from "../Avatar"
import Container from "../Container"
import PlayerCard from "../PlayerCard"
import RadialContainer from "../RadialContainer"
import PlayerCardPopup from "./style/PlayerCardPopup"
import PlayerCardPreview from "./style/PlayerCardPreview"

export default ({
  isPlaceholder = false,
  preview = false,
  popup = null,
  onboardingPlayerCard = undefined,
  onClickPopupButton = undefined,
  photoPreview = null,
  team = null,
  player = null,
  discover = false,
  imageData = null,
  phaseId = null,
}) => {
  const { currentPlayer, currentPhase, currentChallenge } = useCurrentChallenge()

  const imageUrl = imageData || player.avatar?.getUrl("400")
  let playerCurrentScore
  if (currentPhase || phaseId) {
    playerCurrentScore = player.scores?.[currentPhase?.id || phaseId]?._stats?.score || 0
  }

  const PlayerCardComponent = () => {
    return (
      <PlayerCard
        teamLogoUrl={team.logo?.getUrl("400")}
        teamName={team.name}
        player={player}
        // playerUsername={player.username}
        playerNumber={player.number}
        challengeImage={currentChallenge.image}
        challengePlayersAvatarWithoutBackground={currentChallenge.playersAvatarWithoutBackground}
        removeBackground={player.avatar?.removeBackground}
        colors={team.colors}
        playerCurrentScore={playerCurrentScore}
        avatarUrl={imageUrl}
        // preview={preview}
      />
    )
  }

  return (
    <>
      {team && player && currentChallenge && preview && (
        <PlayerCardPreview isPlaceholder={isPlaceholder}>
          <PlayerCardComponent />
        </PlayerCardPreview>
      )}
      {team && player && currentChallenge && popup && (
        <>
          <RadialContainer />
          <PlayerCardPopup>
            {discover && <Title1>Pas mal !</Title1>}
            <PlayerCardComponent />
            <Button
              button
              onClick={() =>
                onClickPopupButton({ currentTeam: team, currentViewer: player, currentPlayer: currentPlayer })
              }
              primary
              style={{ marginTop: "15px", width: "272px" }}
            >
              {discover ? "Ouais, je sais !" : "ok"}
            </Button>
          </PlayerCardPopup>
        </>
      )}
      {imageUrl && photoPreview && (
        <>
          <Container centering>
            <Avatar
              // style={{ textAlign: 'center' }}
              image={imageUrl}
              size={150}
            />
          </Container>
        </>
      )}
      {onboardingPlayerCard && (
        <>
          <PlayerCardComponent />
        </>
      )}
    </>
  )
}
