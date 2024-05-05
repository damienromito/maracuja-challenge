import { USER_ROLES } from "@maracuja/shared/constants"
import { useHistory } from "react-router-dom"
import styled from "styled-components"
import { Text2 } from "."
import ROUTES from "../constants/routes"
import { useAuthUser, useCurrentChallenge } from "../contexts"
import Text3 from "./Text3"

interface CurrentPhaseInfoProps {
  onClickHandler?: any
  rankingFilterValue?: any
  phase?: any
}

export default ({ onClickHandler, rankingFilterValue, phase }: CurrentPhaseInfoProps) => {
  const { currentPhase, currentChallenge } = useCurrentChallenge()
  const { authUser } = useAuthUser()
  const history = useHistory()

  const handleClick = (decrement) => {
    if (onClickHandler && authUser.hasRole(USER_ROLES.ADMIN)) {
      onClickHandler(decrement)
    } else {
      history.push(ROUTES.CALENDAR)
    }
  }

  if (currentChallenge.endDate < new Date()) {
    return (
      <InfoContainer>
        <Text2 className="active-phase-info max-width-container">Challenge terminé</Text2>
      </InfoContainer>
    )
  }

  if (currentChallenge.phases.length < 2) return null

  const displayedPhase = phase || currentPhase

  if (!displayedPhase) {
    const nextPhase = currentChallenge.getNextPhase()
    const previousPhase = currentChallenge.getPreviousPhase()
    if (previousPhase) {
      return (
        <InfoContainer>
          <Text2 className="active-phase-info max-width-container" onClick={() => handleClick(false)}>
            {previousPhase.name} terminée
          </Text2>
        </InfoContainer>
      )
    }
    return null
  }

  return (
    <InfoContainer>
      <Text2 className="active-phase-info icon icon-dot max-width-container" onClick={() => handleClick(false)}>
        {displayedPhase.name} en cours
      </Text2>
      <RankingFilter rankingFilterValue={rankingFilterValue} displayedPhase={displayedPhase} onClick={handleClick} />
    </InfoContainer>
  )
}

const RankingFilter = ({ rankingFilterValue, displayedPhase, onClick }) => {
  const { currentPhase, currentTeam } = useCurrentChallenge()
  const activeFilter =
    displayedPhase?.rankingFilters?.length > 0 && displayedPhase.rankingFilters[currentPhase.rankingFilters.length - 1]
  if (!activeFilter) return null

  return <Text3 onClick={() => onClick(true)}>{rankingFilterValue || currentTeam?.[activeFilter].name}</Text3>
}

const InfoContainer = ({ children }) => {
  return (
    <FixedContainer>
      <Container>{children}</Container>
    </FixedContainer>
  )
}

const FixedContainer = styled.div`
  & > div {
    position: relative;
    width: 100%;
    z-index: 10;
  }
`
const Container = styled.div`
  background: ${(props) => props.theme.bg.tertiary};
  color: ${(props) => props.theme.text.primary};
  padding: 3px 0px;
  text-align: center;
  .text-2.icon:before {
    color: "white";
    font-size: 8px;
    margin: 0 5px 0 0;
    position: relative;
    bottom: 2px;
  }
  .text-3 {
    color: ${(props) => props.theme.text.tertiary};
  }
`
