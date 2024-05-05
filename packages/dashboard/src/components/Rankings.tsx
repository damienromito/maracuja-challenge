import { Team } from "@maracuja/shared/models"
import React from "react"
import styled from "styled-components"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { ClubAvatar } from "@maracuja/shared/components"

export default ({ rankings, rankingFilters, audienceFilters }) => {
  const rankingFilterType = rankingFilters?.[0]
  const rankingFilterTypeValues = rankingFilterType ? audienceFilters?.[rankingFilterType] : null
  return (
    <GroupContainer>
      <FilterTypeRanking rankings={rankings} filterType={rankingFilterType} filterValues={rankingFilterTypeValues} />
    </GroupContainer>
  )
}

const FilterTypeRanking = ({ rankings, filterValues, filterType }) => {
  return rankings.map((ranking, index) => {
    const filterValue = filterValues ? ranking[`${filterType}`] : null
    const teamCount = ranking?.teams?.length || 0
    const teamStatCount = (keyToCount) => ranking?.teams?.reduce((total, team) => total + team[keyToCount], 0) || 0

    return (
      <Group key={"ranking" + index}>
        {filterValue && <h4>{filterValue.name}</h4>}
        <p>
          {teamCount} équipes / 👤{teamStatCount("playerCount")} (✊ {teamStatCount("captainCount")} 👶🏻
          {teamStatCount("refereeCount")}){" "}
        </p>
        {ranking.teams ? (
          <Item>
            <Ranking teams={ranking.teams} phase={ranking.phase} />
          </Item>
        ) : (
          <p>Aucune équipe inscrite</p>
        )}
      </Group>
    )
  })
}

const Ranking = ({ teams, phase }) => {
  return teams.map((t, index) => {
    const team = new Team(t)
    return <TeamItem key={team.id} team={team} index={index} phase={phase} />
  })
}

const TeamItem = ({ team, index, phase }) => {
  const { currentChallenge } = useCurrentChallenge()
  const pricedColor = phase.priceCount && index < phase.priceCount ? "black" : "gray"
  const teamScore = team.scoreForPhase({ phaseId: phase?.id, isRankingScore: true })
  const progression = team.scoreForPhase({ phaseId: phase?.id, isRankingScore: true, metric: "progression" })

  const handleOnClickTeam = () => {
    window.open(`/challenges/${currentChallenge.id}/teams/${team.id}`)
  }

  return (
    <ClubItemContainer style={{ color: pricedColor }}>
      <div>
        <p onClick={handleOnClickTeam} className="name ellipsis">
          <strong style={{ fontWeight: 900 }}>
            {index + 1} - {team.name}
          </strong>
        </p>
        <p className="stats">
          {teamScore}pts | {progression} entrainé | 👤 {team.playerCount} (✊ {team.captainCount || "0"}
          {currentChallenge.referralEnabled && `- 👶🏻 ${team.refereeCount || "0"}`})
        </p>
      </div>
      <ClubAvatar logo={team.logo?.getUrl("120")} size={30} />
    </ClubItemContainer>
  )
}

const GroupContainer = styled.div`
  display: flex;
  max-width: 100%;
  width: 930px;
  flex-flow: row wrap;
  margin: auto;
  justify-content: center;
`
const Group = styled.div`
  width: 300px;
  display: inline-block;
  margin: 0 8px 8px 0;
  padding: 30px 15px;
  h3 {
    text-transform: uppercase;
    text-align: center;
    word-break: break-word;
  }
  & > p {
    text-align: center;
    font-size: 15px;
    color: ${(props) => props.theme.text.tertiary};
  }
`

const Item = styled.div`
  display: block;
  line-height: 30px;
  span {
    text-transform: uppercase;
  }
  i {
    font-size: 13px;
    font-style: normal;
    margin-left: 8px;
  }
`

const ClubItemContainer = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  .name,
  .stats {
    margin: 0;
  }
  .name {
    cursor: pointer;
  }
`
