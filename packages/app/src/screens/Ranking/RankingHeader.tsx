import { ACTIVITY_TYPES, ROLES, USER_ROLES } from "@maracuja/shared/constants"
import { useState } from "react"
import styled from "styled-components"
import { Container, CurrentPhaseInfo, EventCountDown, Text2 } from "../../components"
import { useAuthUser, useCurrentChallenge } from "../../contexts"

export default () => {
  return (
    <Header>
      <RankingPhaseInfo />
      <CountDown />
      <RankingInfo />
    </Header>
  )
}

const RankingInfo = () => {
  const { currentPhase, currentChallenge, currentQuestionSet } = useCurrentChallenge()
  if (!currentPhase) return null

  if (currentQuestionSet?.type === ACTIVITY_TYPES.TRAINING) {
    return (
      <Container style={{ textAlign: "center", padding: "10px 0 10px 0 " }}>
        <Text2>Les {currentChallenge.wording.tribe}s s'entrainent... </Text2>
      </Container>
    )
  }

  if (!!currentPhase.priceCount && !currentPhase.isFinale) {
    return (
      <Container>
        <Text2 className="info-text max-width-container">
          ⭐️ Les {currentPhase.priceCount} {currentChallenge.wording.firstTribes} se qualifient pour la phase suivante.
        </Text2>
      </Container>
    )
  }

  return null
}

const RankingPhaseInfo = ({ onloadRankingPage = undefined, ranking = undefined, setRanking = undefined }) => {
  const { currentPhase, currentChallenge, currentScoreType, getNextQuestionSet } = useCurrentChallenge()
  const { userHasOrgaRole } = useAuthUser()

  const [rankingFilterValue, setRankingFilterValue] = useState(null)

  const handleLoadOtherRankingFilter = async (decrement) => {
    if (userHasOrgaRole([USER_ROLES.ADMIN]) && currentPhase?.rankingFilters) {
      const rankingfilter = currentPhase.rankingFilters
      const filters = currentChallenge.audience.filters[rankingfilter]
      const currentRankingFilter = ranking[rankingfilter]
      if (ranking && currentRankingFilter) {
        const currentRankingIndex = filters.findIndex((filter) => filter.id === currentRankingFilter.id)
        let nextRankingIndex
        if (currentRankingIndex < 0 || (decrement && currentRankingIndex === 0)) {
          nextRankingIndex = filters.length - 1
        } else if (!decrement && currentRankingIndex === filters.length - 1) {
          nextRankingIndex = 0
        } else {
          nextRankingIndex = currentRankingIndex + (decrement ? -1 : 1)
        }
        const nextRankingId = currentPhase.id + "-" + filters[nextRankingIndex].id
        const r = await onloadRankingPage(nextRankingId)
        setRanking(r)
        setRankingFilterValue(`
          ${filters[nextRankingIndex].name} (${nextRankingIndex + 1}/${filters.length}) 
          - (${r.teams?.length || 0} équipes) 
          - (${r.teams?.reduce((total, team) => total + team.playerCount, 0) || 0} joueurs)`)
      }
    }
  }

  return <CurrentPhaseInfo onClickHandler={handleLoadOtherRankingFilter} rankingFilterValue={rankingFilterValue} />
}

const CountDown = () => {
  const { currentPhase, currentChallenge, currentQuestionSet, getNextQuestionSet } = useCurrentChallenge()

  const now = new Date()

  if (currentPhase) {
    if (!currentQuestionSet?.isOnboarding) return null
    const nextQuestionSet = getNextQuestionSet()
    if (!nextQuestionSet) return null
    return <EventCountDown date={nextQuestionSet.startDate} text="Le challenge commence dans" />
  }

  const nextPhase = currentChallenge.getNextPhase()
  if (!nextPhase) return null

  if (currentChallenge.startDate > now) {
    return <EventCountDown date={nextPhase.startDate} text="Le challenge commence dans" />
  }
  return <EventCountDown date={nextPhase.startDate} text="La prochaine phase commence dans" />
}

const Header = styled.div`
  background: ${(props) => props.theme.bg.secondary};
`
