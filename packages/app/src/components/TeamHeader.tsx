import { ClubAvatar, TeamScoresDetail } from "@maracuja/shared/components"
import { useApp, useCurrentChallenge } from "../contexts"
import { size, styled } from "../styles"

export default ({ club, children = null }) => {
  const { currentPhase, currentChallenge } = useCurrentChallenge()
  const clubScore = currentChallenge.getCurrentScoreForTeam(club)

  const { openPopup } = useApp()

  const handleClickScores = () => {
    if (currentPhase && !currentChallenge.topPlayersEnabled) {
      openPopup({
        title: club.name,
        message: "",
        buttonText: "Ok",
        children: <TeamScoresDetail phase={currentPhase} team={club} />,
      })
    }
  }

  return (
    <ClubHeaderContainer>
      <div className="content">
        <ClubHeaderIcon>
          <div className="stat">
            <b>{(club && club.playerCount) || "-"}</b>
            <div>JOUEURS</div>
          </div>
          <div className="icon icon-shirt" />
        </ClubHeaderIcon>
        <ClubAvatar
          logo={club?.logo?.getUrl("200")}
          size={100}
          color={currentChallenge.team?.displayColorLogo && club.colors.primary}
        />

        {clubScore ? (
          <ClubHeaderIcon onClick={handleClickScores}>
            <div className="icon icon-competition-small" />
            <div className="stat">
              <b>{clubScore} </b>
              <div>POINTS</div>
            </div>
          </ClubHeaderIcon>
        ) : (
          <ClubHeaderIcon />
        )}
      </div>
      {children}
    </ClubHeaderContainer>
  )
}

const ClubHeaderIcon = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
  font-size: 10px;
  justify-content: center;
  line-height: 15px;
  max-width: 120px;
  text-align: center;
  div {
    flex: 1 1 auto;
  }
  .icon {
    font-size: 32px;
  }
  b {
    font-size: 24px;
  }
`

const ClubHeaderContainer = styled.div`
  background: ${(props) => props.theme.bg.secondary};
  padding: 16px;
  .content {
    align-items: center;
    background: ${(props) => props.theme.bg.tertiary};
    border-radius: ${size.borderRadius};
    display: flex;
    flex-direction: row;
    height: 64px;
    justify-content: space-between;
    margin: 30px 0;

    .stat {
      padding-top: 5px;
    }

    &:before {
      /*margin-top : -25px;*/
      background: rgba(255, 255, 255, 0.1);
      border-radius: 100px;
      content: "";
      height: 110px;
      left: 50%;
      margin-left: -55px;
      position: absolute;
      width: 110px;
      z-index: -1;
    }

    .logoUpload {
      height: 100%;
      max-width: 130px;
      text-align: center;
      button {
        font-size: 15px;
        height: 100%;
        text-decoration: underline;
        width: 100%;
      }
    }
  }
`
