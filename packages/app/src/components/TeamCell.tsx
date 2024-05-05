import React, { useEffect } from "react"
import styled from "styled-components"
import { useCurrentChallenge } from "../contexts"
import Badge from "./Badge"
import ClubAvatar from "@maracuja/shared/components/ClubAvatar"
import StatWithIcon from "./StatWithIcon"
import Title4 from "./Title4"

export default ({ team, sizeScreen = false, rank = "-", phase = null, onClickCell }) => {
  const { currentPhase, currentTeam, currentChallenge } = useCurrentChallenge()
  const isCurrentTeam = team.id === currentTeam.id
  useEffect(() => {
    if (!phase && currentPhase) {
      phase = currentPhase
    }
  }, [])

  return (
    <CellContainer
      rank={rank}
      sizeScreen={sizeScreen}
      onClick={() => onClickCell(team)}
      className={`team-cell ${team.prized ? "classified" : ""} ${isCurrentTeam ? "isCurrentTeam" : ""}`}
    >
      {phase.rankingStats?.score && <div className="rank">{rank}</div>}
      <ClubAvatar
        logo={team.logo?.getUrl("120")}
        classified={team.prized}
        color={currentChallenge.team?.displayColorLogo && team.colors?.primary}
      />
      <div className="titles">
        <Title4 className="ellipsis" style={{ paddingBottom: "3px" }}>
          {team.name}
        </Title4>
        <TeamStats team={team} phase={phase} />
        {phase && phase.displayedFilter && team.displayedFilter && <Badge>{team.displayedFilter}</Badge>}
      </div>
    </CellContainer>
  )
}

const TeamStats = ({ team, phase }) => {
  const score = team.scoreForPhase({ phaseId: phase?.id, isRankingScore: true })
  const progression = team.scoreForPhase({ phaseId: phase?.id, isRankingScore: true, metric: "progression" })

  const refereeCount = phase.rankingStats.refereeCount && phase.rankingStats?.refereeCount && (team.refereeCount || 0)
  const captainCount = phase.rankingStats.captainCount && phase.rankingStats?.captainCount && (team.captainCount || 0)
  const playerCount =
    phase.rankingStats.playerCount && (team.playerCount || 0) - (captainCount || 0) - (refereeCount || 0)

  return (
    <StatsContainer>
      {score !== null && phase.rankingStats?.score && <StatWithIcon>{score || 0} POINTS</StatWithIcon>}
      {phase.rankingStats?.progression && <StatWithIcon icon="warm-up-small">{progression}</StatWithIcon>}
      {!!playerCount && <StatWithIcon icon="shirt">{playerCount}</StatWithIcon>}
      {!!captainCount && (
        <StatWithIcon icon="cap">
          <span style={{ marginLeft: "3px" }}>{captainCount}</span>
        </StatWithIcon>
      )}
      {!!refereeCount && (
        <StatWithIcon icon="supporter">
          <span style={{ marginLeft: "3px" }}>{refereeCount}</span>
        </StatWithIcon>
      )}
      {!!phase.rankingStats?.ideaCount && <StatWithIcon icon="bulb">{team.ideaCount() || 0}</StatWithIcon>}
    </StatsContainer>
  )
}

interface CellContainerProps {
  rank: number | string
  sizeScreen: boolean
}
const CellContainer = styled.div<CellContainerProps>`
  display: flex;
  flex-direction: row;
  padding: 15px;
  color: white;
  background: transparent;
  &.clickable,
  &:hover {
    background: transparent;
  }
  &.isCurrentTeam {
    background: ${(props) => props.theme.bg.active};
  }
  .rank {
    font-size: ${(props) => (props.sizeScreen ? "52px" : props.rank < 10 ? "22px" : props.rank < 99 ? "20px" : "16px")};
    width: ${(props) => (props.sizeScreen ? "65px" : "30px")};
    font-family: "Montserrat";
    font-weight: 600;
    text-align: center;
    margin-right: 10px;
    align-self: center;
  }
  &.classified {
    .rank {
      color: ${(props) => props.theme.icon.highlighted};
    }
  }

  .titles {
    text-overflow: ellipsis;
    display: flex;
    text-align: left;
    text-transform: capitalize;
    flex-direction: column;
    align-items: baseline;
    white-space: nowrap;
    overflow: hidden;
    margin-left: 10px;
    flex: 1;
    h4 {
      font-size: ${(props) => (props.sizeScreen ? "38px" : "inherit")};
    }
    .subtitle {
      color: ${(props) => props.theme.text.tertiary};
      font-size: ${(props) => (props.sizeScreen ? "30px" : "inherit")};
      line-height: ${(props) => (props.sizeScreen ? "38px" : "inherit")};
    }
  }
`

const StatsContainer = styled.div`
  display: flex;
  flex-direction: row;
`
