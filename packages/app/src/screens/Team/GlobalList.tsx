import { PLAYER_ROLES } from "@maracuja/shared/constants"
import ROLES from "@maracuja/shared/constants/roles"
import { capitalizeFirstLetter } from "@maracuja/shared/helpers"
import React, { useState } from "react"
import {
  Button,
  CalendarWeekDays,
  Container,
  PlayerIcon,
  PlayerListItem,
  SharePopup,
  TabMenu,
  Text1,
} from "../../components"
import { useCurrentChallenge } from "../../contexts"
import { styled } from "../../styles"
import CoachCell from "./CoachCell"
import MemberToRecruitList from "./MemberToRecruitList"
import PlayerList from "./PlayerList"
import UsersContainer from "./style/UsersContainer"

/// ////////////////// HEADER

export default ({ team }) => {
  const { currentPhase, currentChallenge, currentTeam, currentPlayer } = useCurrentChallenge()

  const [listType, setListType] = useState(currentPlayer.hasRole(ROLES.REFEREE) ? "referees" : "licensees")

  const replaceWithTheCapitalLetter = (values) => {
    return values.charAt(0).toUpperCase() + values.slice(1)
  }

  return (
    <>
      {currentPlayer.hasRole([ROLES.CAPTAIN]) && currentPhase?.captainEditTeam.name && currentTeam.name.length > 0 && (
        <div style={{ backgroundColor: "#89BCF7", color: "black", textAlign: "center" }}>
          <Container>
            <Text1 style={{ margin: "0" }}>
              😎 {replaceWithTheCapitalLetter(currentChallenge.wording && currentChallenge.wording.captain)}, tu peux
              modifier la page de l’équipe jusqu’au recrutement des joueurs.
            </Text1>
          </Container>
        </div>
      )}

      <UsersContainer>
        {/* && !currentPlayer.hasRole(PLAYER_ROLES.REFEREE) */}
        {currentChallenge.referralEnabled && <PlayerTypeTab team={team} tab={listType} setTab={setListType} />}

        {currentChallenge.team.displayOnlyCurrentWeek && (
          <WeekDaysHeader style={{ display: "flex", flexDirection: "row" }}>
            <CalendarWeekDays style={{ width: 175 }} />
          </WeekDaysHeader>
        )}
        {currentChallenge.onboarding?.needCaptain && team.captainCount >= 1 && <InviteCaptainCell />}
        {!currentPlayer.hasRole(PLAYER_ROLES.REFEREE) && (
          <>
            {currentChallenge.sharingEnabled && <InvitePlayerCell />}
            {!currentChallenge.sharingEnabled && currentChallenge.referralEnabled && <InviteRefereeCell />}
          </>
        )}
        <PlayerList team={team} listType={listType} />
        {currentChallenge.coachEnabled && <CoachCell />}
        {!!team.members?.length &&
          (currentPlayer.hasRole(PLAYER_ROLES.CAPTAIN) || !currentChallenge.recruitment?.onlyForCaptain) &&
          !currentPlayer.hasRole(PLAYER_ROLES.REFEREE) && <MemberToRecruitList team={team} />}
      </UsersContainer>
    </>
  )
}

const WeekDaysHeader = styled.div`
  position: "relative";
  width: 100%;
  z-index: 10;
  display: flex;
  flex-direction: row;
  background: ${(props) => props.theme.bg.tertiary};
  padding: 3px 0px 3px 73px;
`

const InviteCaptainCell = () => {
  const { currentChallenge } = useCurrentChallenge()
  const [popupIsOpen, setPopupIsOpen] = useState(false)

  const handleClickInviteCaptain = () => {
    setPopupIsOpen(true)
  }
  return (
    <>
      <PlayerListItem
        key="invite-captain"
        playerIcon={<PlayerIcon role={PLAYER_ROLES.CAPTAIN} />}
        title={`Invite ton ${currentChallenge.wording.captain}`}
        rightContent={<Button onClick={handleClickInviteCaptain}>Inviter</Button>}
      />

      <SharePopup isOpen={popupIsOpen} setIsOpen={setPopupIsOpen} contentType="captain" />
    </>
  )
}

const InvitePlayerCell = () => {
  const { currentChallenge } = useCurrentChallenge()
  const [popupIsOpen, setPopupIsOpen] = useState(false)

  const handleClickInvitePlayer = () => {
    setPopupIsOpen(true)
  }
  return (
    <>
      <PlayerListItem
        key="invite-player"
        playerIcon={<PlayerIcon />}
        title={currentChallenge.wording.inviteAPlayer}
        rightContent={<Button onClick={handleClickInvitePlayer}>Inviter</Button>}
      />

      <SharePopup isOpen={popupIsOpen} setIsOpen={setPopupIsOpen} openOnMenu />
    </>
  )
}

const InviteRefereeCell = () => {
  const { currentChallenge } = useCurrentChallenge()
  const [popupIsOpen, setPopupIsOpen] = useState(false)

  const handleClickInvitePlayer = () => {
    setPopupIsOpen(true)
  }
  return (
    <>
      <PlayerListItem
        key="invite-referee"
        playerIcon={<PlayerIcon role={PLAYER_ROLES.REFEREE} />}
        title={currentChallenge.referral.sharing.inviteAReferee}
        rightContent={<Button onClick={handleClickInvitePlayer}>Inviter</Button>}
      />
      <SharePopup isOpen={popupIsOpen} setIsOpen={setPopupIsOpen} contentType="referee" />
    </>
  )
}

const PlayerTypeTab = ({ tab, setTab, team }) => {
  const { currentChallenge } = useCurrentChallenge()

  return (
    <TabMenu
      tabsIds={["licensees", "referees"]}
      tabsContent={[
        <p key="licensees">
          {team.playerCount - (team.refereeCount || 0)} {capitalizeFirstLetter(currentChallenge.wording.members)}
        </p>,
        <p key="referees">
          {team.refereeCount || 0} {capitalizeFirstLetter(currentChallenge.wording.referees)}
        </p>,
      ]}
      activeId={tab}
      setActiveId={setTab}
    />
  )
}
