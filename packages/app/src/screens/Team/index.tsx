import { TRAINING } from "@maracuja/shared/constants/activityTypes"
import ROLES from "@maracuja/shared/constants/roles"
import { Team } from "@maracuja/shared/models"
import { useEffect, useState } from "react"
import { useHistory, useRouteMatch } from "react-router-dom"
import styled from "styled-components"
import { CurrentPhaseInfo, NavBar, SpectatorButton, TeamHeader } from "../../components"
import TeamSuggestions from "../../components/TeamSuggestions"
import ROUTES from "../../constants/routes"
import { useApp, useCurrentChallenge } from "../../contexts"
import { currentDate } from "../../utils/helpers"
import CaptainMotivationButton from "./CaptainMotivationButton"
import PlayerList from "./GlobalList"
import IcebreakerButton from "./IcebreakerButton"
import PageContent from "./style/PageContent"
import TextInfo from "./style/TextInfo"

export default () => {
  const { currentPhase, currentChallenge, currentTeam, currentPlayer } = useCurrentChallenge()
  const history = useHistory()
  const match = useRouteMatch<any>()

  const [team, setTeam] = useState(currentTeam)

  useEffect(() => {
    if (currentTeam) {
      loadClubPage()
    }
  }, [currentTeam])

  const loadClubPage = async () => {
    if (match.params.teamId && (!team || team.id !== match.params.teamId)) {
      const team = await Team.fetch({ challengeId: currentChallenge.id, id: match.params.teamId })
      setTeam(team)
    } else {
      setTeam(currentTeam)
    }
  }

  return (
    <>
      {currentPlayer.hasRole(ROLES.CAPTAIN) && currentPhase?.captainEditTeam && currentPhase.captainEditTeam.logo ? (
        <NavBar title={team && team.name} rightAction={() => history.push(ROUTES.EDIT_ACTIVE_CLUB)} rightIcon="edit" />
      ) : (
        <NavBar title={team && team.name} />
      )}

      <CurrentPhaseInfo />
      {currentTeam.id === team.id && <TeamSuggestions />}
      <PageContent>
        <TeamHeader club={team}>
          <TeamMotivationButton />
          <IcebreakerButton />
          <TeamIndications />
        </TeamHeader>

        <PlayerList team={team} />
      </PageContent>
    </>
  )
}

const TeamIndications = () => {
  const { currentPhase, currentChallenge, currentRanking, currentQuestionSet } = useCurrentChallenge()
  const { openPopup } = useApp()

  if (!currentPhase || !currentChallenge.icebreakerEnabled) return null
  const isAuthorized = currentRanking?.currentTeamSelected

  if (currentQuestionSet && !isAuthorized && currentRanking) return <SpectatorHeaderButton />
  if (!currentChallenge.topPlayersEnabled || currentPhase?.type === TRAINING) return null
  return (
    <TextInfo
      style={{ fontSize: 14, margin: "10px auto 0 auto", display: "block" }}
      onClick={() => {
        const popupInfos = {
          title: `Calcul du score ${currentChallenge.wording.ofTheTribe}`,
          message: currentChallenge.topPlayers.rules,
          buttonText: "Ok",
        }
        openPopup(popupInfos)
      }}
    >
      Score = Top {currentChallenge.topPlayers.members} {currentChallenge.wording.players}
      {currentChallenge.topPlayers.referees && currentChallenge.referralEnabled ? (
        <>
          {" "}
          + Top {currentChallenge.topPlayers.referees} {currentChallenge.wording.referees}
        </>
      ) : null}
      <i className="icon-help" style={{ fontSize: 20, fontWeight: "bold", marginLeft: 5 }} />
    </TextInfo>
  )
}

const TeamMotivationButton = () => {
  const { currentChallenge, currentTeam, currentPlayer, currentPhase } = useCurrentChallenge()
  const [lastMotivationIsToday, setLastMotivationIsToday] = useState(false)
  const { loading } = useApp()

  const checkTimeIsToday = () => {
    const dateOfLastMotivation = currentTeam.motivatedAt.toDate()
    const dateOfToday = currentDate()
    dateOfToday.setHours(0)
    dateOfToday.setMinutes(0)
    dateOfToday.setSeconds(0)

    if (dateOfLastMotivation.getTime() > dateOfToday.getTime()) {
      setLastMotivationIsToday(true)
    }
  }

  useEffect(() => {
    if (currentTeam) {
      currentTeam.motivatedAt && checkTimeIsToday()
    }
  }, [currentTeam])

  if (!currentPhase) return null

  const displayMotivationButton = currentChallenge.captainCanMotivate && currentPlayer.hasRole(ROLES.CAPTAIN)
  return (
    <>{displayMotivationButton && !lastMotivationIsToday && <CaptainMotivationButton disabledButton={loading} />}</>
  )
}

const SpectatorHeaderButton = styled(SpectatorButton)`
  margin-top: 10px;
  align-self: center;
  width: 100%;
  text-align: center;
  max-width: 750px;
  margin-left: auto;
  margin-right: auto;
`
