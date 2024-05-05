import { USER_ROLES, WHITELIST_TYPES } from "@maracuja/shared/constants"
import { useAuthUser, useCurrentChallenge, useCurrentOrganisation } from "@maracuja/shared/contexts"
import maracujaLogo from "@maracuja/shared/images/maracujaLogo.svg"
import { Layout, Menu, Switch } from "antd"
import React, { useEffect, useMemo, useState } from "react"
import { matchPath } from "react-router"
import { generatePath, useHistory, useLocation } from "react-router-dom"
import ROUTES from "../../constants/routes"
import { capitalizeFirstLetter } from "@maracuja/shared/helpers"

const { Sider } = Layout

export default ({ collapsed, setCollapsed }) => {
  const { currentOrganisation } = useCurrentOrganisation()
  const { currentChallenge, getChallengesHistory, setCurrentChallengeById } = useCurrentChallenge()
  const { onSignOut, authUser } = useAuthUser()
  const history = useHistory()

  const location = useLocation<any>()

  useEffect(() => {}, [location.pathname])

  const handleItemClicked = (props) => {
    switch (props.key) {
      case "logout":
        handleSignOut()
        break

      default:
        {
          const matchProfile: any = matchPath(props.key, { path: ROUTES.CHALLENGE })
          if (matchProfile) {
            setCurrentChallengeById(matchProfile.params.challengeId)
          }
          history.push(props.key)
        }
        break
    }
  }

  const handleSignOut = async () => {
    localStorage.removeItem("organisationId")
    localStorage.removeItem("challengeId")
    await onSignOut()
    history.push(ROUTES.HOME)
  }

  const items = useMemo(() => {
    const data = []

    if (authUser.hasRole(USER_ROLES.SUPER_ADMIN)) {
      data.push({
        icon: <span>😎</span>,
        label: "Admin",
        key: "admin",
        children: [
          {
            icon: <span>🏠</span>,
            label: "Organisations",
            key: ROUTES.ORGANISATIONS,
          },
          { icon: <span>🏴</span>, label: "Clubs", key: ROUTES.CLUBS },
          { icon: <span>🏴</span>, label: "Tribus", key: ROUTES.TRIBES },
          // { icon: <Switch defaultChecked={false} onChange={() => alert('ok')} />, label: 'Mode Organisateur',  key: 'adminMode' }
        ],
      })
    }
    if (currentOrganisation) {
      data.push({
        icon: <span>🏠</span>,
        label: `${currentOrganisation.name}`,
        key: "organisation",
        children: [
          {
            icon: <span>🏆</span>,
            label: "Challenges",
            key: generatePath(ROUTES.ORGANISATION, {
              organisationId: currentOrganisation.id,
            }),
          },
          {
            icon: <span>🧩</span>,
            label: "Bibliothèque",
            key: generatePath(ROUTES.MODULES, {
              organisationId: currentOrganisation.id,
            }),
          },
          {
            icon: <span>🛠</span>,
            label: "Configuration",
            key: generatePath(ROUTES.ORGANISATION_SETTINGS, {
              organisationId: currentOrganisation.id,
            }),
          },
        ],
      })
    } else {
      data.push({
        icon: <span>🏠</span>,
        label: "Organisations",
        key: ROUTES.HOME,
      })
    }

    if (currentChallenge && currentOrganisation) {
      const challengeMenu = getChallengeMenu({
        isSuperAdmin: authUser.isSuperAdmin(),
        currentChallenge: currentChallenge,
      })
      data.push(challengeMenu)
    }
    // LAST CHALLENGES
    const challengesHistory = getChallengesHistory()
    if (challengesHistory.length) {
      challengesHistory.forEach((challenge) => {
        if (challenge.id === currentChallenge?.id) return
        data.push({
          icon: <span>🔵</span>,
          label: challenge.code === "NOCODE" ? challenge.name : challenge.code,
          key: generatePath(ROUTES.CHALLENGE, { challengeId: challenge.id }),
        })
      })
    }

    // USER
    data.push({
      icon: <span>🙂</span>, // <img src={authUser.avatar.getUrl('100')} />,
      label: authUser.username,
      key: "user",
      children: [{ icon: <span>❌</span>, label: "Se deconnecter", key: "logout" }],
    })

    return data
  }, [])

  const defaultOpenKeys = useMemo(() => {
    const openKeys = []
    if (currentOrganisation) {
      openKeys.push("organisation")
    }
    if (currentChallenge) {
      openKeys.push("challenge")
    }
    return openKeys
  }, [])

  const handleOnClickLogo = () => {
    history.push(ROUTES.HOME)
  }

  return (
    <Sider
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
      }}
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
    >
      <div
        className="logo"
        onClick={handleOnClickLogo}
        style={{ color: "white", textAlign: "center", margin: "20px 0 0 0" }}
      >
        <img src={maracujaLogo} width={collapsed ? "50" : "120"} />
      </div>

      <Menu
        theme="dark"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={defaultOpenKeys}
        mode="inline"
        items={items}
        onClick={handleItemClicked}
      />
    </Sider>
  )
}

const getChallengeMenu = ({ isSuperAdmin, currentChallenge }) => {
  // CURRENT CHALLENGE
  const challengeRoute = (route) => {
    return generatePath(route, { challengeId: currentChallenge.id })
  }

  const children = []

  children.push({
    icon: <span>🏠</span>,
    label: "Tableau de bord",
    key: generatePath(ROUTES.CHALLENGE, {
      challengeId: currentChallenge.id,
    }),
  })

  children.push({
    icon: <span>📅</span>,
    label: "Calendrier",
    key: challengeRoute(ROUTES.CHALLENGE_CALENDAR),
  })

  if (currentChallenge.audience?.whitelist === WHITELIST_TYPES.MAILING_LIST) {
    children.push({
      icon: <span>📧</span>,
      label: "Participants",
      key: challengeRoute(ROUTES.CHALLENGE_WHITELIST),
    })
  }
  children.push({
    icon: <span>🥇</span>,
    label: "Classements",
    key: challengeRoute(ROUTES.CHALLENGE_RANKINGS),
  })
  if (currentChallenge.surveysEnabled) {
    children.push({
      icon: <span>📊</span>,
      label: "Sondages",
      key: challengeRoute(ROUTES.CHALLENGE_SURVEYS),
    })
  }

  if (currentChallenge.icebreakerEnabled) {
    children.push({
      icon: <span>👬</span>,
      label: "Icebreaker",
      key: challengeRoute(ROUTES.CHALLENGE_ICEBREAKER),
    })
  }
  if (currentChallenge.ideasBoxesEnabled) {
    children.push({
      icon: <span>💡</span>,
      label: "Boite à idées",
      key: challengeRoute(ROUTES.CHALLENGE_IDEASBOXES),
    })
  }
  if (isSuperAdmin) {
    children.push({
      icon: <span>😎</span>,
      label: "Joueurs (detail)",
      key: challengeRoute(ROUTES.CHALLENGE_PLAYERS),
    })

    children.push({
      icon: <span>✊</span>,
      label: capitalizeFirstLetter(currentChallenge.wording?.captains || "Capitaines"),
      key: challengeRoute(ROUTES.CHALLENGE_NOTIFICATIONS_PLAYERS),
    })
  }
  if (currentChallenge.referralEnabled) {
    children.push({
      icon: <span>👶</span>,
      label: "Filleuls",
      key: challengeRoute(ROUTES.CHALLENGE_REFEREES),
    })
  }

  if (isSuperAdmin) {
    children.push({
      icon: <span>🛠</span>,
      label: "Configuration",
      key: generatePath(ROUTES.CHALLENGE_SETTINGS, {
        challengeId: currentChallenge.id,
        settingId: "general",
      }),
    })

    children.push({
      icon: <span>🏴</span>,
      label: "Équipes",
      key: challengeRoute(ROUTES.CHALLENGE_TEAMS),
    })

    children.push({
      icon: <span>🔔</span>,
      label: "Notifications",
      key: challengeRoute(ROUTES.CHALLENGE_NOTIFICATIONS),
    })
    children.push({
      icon: <span>🛠</span>,
      label: "ADMIN",
      key: challengeRoute(ROUTES.CHALLENGE_CONFIGURATION),
    })
  }

  return {
    icon: <span>🏆</span>,
    label: currentChallenge.code === "NOCODE" ? currentChallenge.name : currentChallenge.code,
    key: "challenge",
    children,
  }
}
