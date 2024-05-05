import { IonModal } from "@ionic/react"
import { ClubAvatar } from "@maracuja/shared/components"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import {
  CalendarWeekDays,
  PlayerIcon,
  PlayerWeekQuestionSets,
  SpectatorButton,
  Text2,
  Text3,
  Title2,
} from "../../components"
import PhaseQuestionSets from "../../components/PhaseQuestionSets"
import PlayerCardViewer from "../../components/PlayerCardViewer"
import ROUTES from "../../constants/routes"
import { useCurrentChallenge } from "../../contexts"
import { size, styled } from "../../styles"

export default (props) => {
  const history = useHistory()

  const { currentPlayer, currentTeam, currentPhase, currentChallenge } = useCurrentChallenge()
  const [showCardPreview, setShowCardPreview] = useState(false)

  return (
    <PlayerInfoContainer {...props}>
      <PlayerContainer
        className="item user"
        onClick={() =>
          !currentPlayer.avatar ? history.push(ROUTES.EDIT_CURRENT_PLAYER + "/photo") : setShowCardPreview(true)
        }
      >
        <PlayerIcon role={currentPlayer.roles[0]} size={25} />
        <Text3 className="username">{currentPlayer.username || currentPlayer.firstName}</Text3>
        <div>
          {currentChallenge.team.displayOnlyCurrentWeek ? (
            <>
              <CalendarWeekDays style={{ width: 175 }} />
              <PlayerWeekQuestionSets user={currentPlayer} />
            </>
          ) : (
            <PhaseQuestionSets user={currentPlayer} />
          )}
        </div>
      </PlayerContainer>

      <IonModal isOpen={showCardPreview}>
        <PlayerCardViewer
          popup
          onClickPopupButton={() => {
            setShowCardPreview(false)
          }}
          team={currentTeam}
          player={currentPlayer}
          discover={false}
        />
      </IonModal>

      <TeamInfos />
    </PlayerInfoContainer>
  )
}

const PlayerInfoContainer = styled.div`
  border-radius: ${size.borderRadius};
  background: ${(props) => props.theme.bg.active};
  display: flex;
  flex-direction: column;
  text-align: left;
`

const PlayerContainer = styled.div`
  padding: 10px 15px;
  display: flex;
  align-items: stretch;
  flex-direction: row;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  p {
    align-self: center;
  }
  .user-avatar {
    margin-right: 5px;
    align-self: center;
    &:before {
      margin: auto;
      height: 30px;
    }
  }
  .username {
    flex: 1;
  }
  .info {
    color: ${(props) => props.theme.bg.tertiary};
  }
`

const ClubContainer = styled.button`
  align-items: center;
  display: flex;
  flex-direction: row;
  padding: 10px 15px;

  > div {
    flex-direction: column;
    &.center {
      flex: 1;
      justify-content: space-around;
      margin-left: 10px;
      text-align: left;
      p.club-name {
        color: white;
        height: 22px;
        text-transform: capitalize;
      }
      h2 {
        color: white;
        font-weight: 600;
        height: 22px;
        text-align: left;
      }
    }
    &.right {
      color: ${(props) => props.theme.text.primary};
      position: relative;
    }
  }
  .text-3 {
    color: ${(props) => props.theme.text.tertiary};
  }
  &.classified {
    h2 {
      color: ${(props) => props.theme.icon.highlighted};
    }
  }
`

// const PlayerInfo = (props) => {
//   const history = useHistory()

//   const { currentPlayer, currentTeam, currentChallenge } = useCurrentChallenge()
//   const [showCardPreview, setShowCardPreview] = useState(false)

//   return (
//     <PlayerInfoContainer {...props}>
//       <PlayerContainer className='item user' onClick={() => !currentPlayer.avatar ? history.push(ROUTES.EDIT_CURRENT_PLAYER + '/photo') : setShowCardPreview(true)}>
//         <PlayerIcon roles={currentPlayer.roles} size={25} player={currentPlayer} />
//         <Text3 className='username'>{currentPlayer.username || currentPlayer.firstName}</Text3>
//         <PlayerWeekQuestionSets user={currentPlayer} />
//       </PlayerContainer>

//       <IonModal isOpen={showCardPreview}>
//         <PlayerCardViewer
//           colors={currentTeam.colors}
//           popup
//           onClickPopupButton={() => { setShowCardPreview(false) }}
//           team={currentTeam}
//           currentPlayer={currentPlayer}
//           player={currentPlayer}
//           challenge={currentChallenge}
//           image={currentPlayer.avatar?.getUrl('400')}
//           removeBackground={currentPlayer.avatar?.removeBackground}
//           discover={false}
//         />
//       </IonModal>

//       <TeamInfos />

//     </PlayerInfoContainer>
//   )
// }

const TeamInfos = () => {
  const history = useHistory()

  const { currentPhase, currentTeam, currentRanking, currentChallenge } = useCurrentChallenge()

  const clubScore = currentTeam.scoreForPhase({ phase: currentPhase })

  const CurrentPhaseInfos = () => {
    return <Title2>#{currentRanking.currentTeamRank || "-"}</Title2>
  }
  return (
    currentTeam && (
      <ClubContainer
        onClick={() => history.push(ROUTES.ACTIVE_CLUB)}
        className={currentRanking && currentRanking.currentTeamisSelected ? "classified" : ""}
      >
        <div className="left ">
          <ClubAvatar logo={currentTeam.logo ? currentTeam.logo.getUrl("120") : null} size={50} />
        </div>
        <div className="center">
          <Text2 className="ellipsis club-name">{currentTeam.name.toLowerCase()}</Text2>
          {currentPhase && currentRanking ? (
            currentRanking.currentTeamSelected ? (
              <CurrentPhaseInfos />
            ) : (
              <SpectatorButton />
            )
          ) : null}
        </div>
        <div className=" right icon icon-arrow-right" />
      </ClubContainer>
    )
  )
}
