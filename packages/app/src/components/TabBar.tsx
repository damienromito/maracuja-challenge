import { IonFooter, IonToolbar } from "@ionic/react"
import React, { useEffect, useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import ROUTES from "../constants/routes"
import { useApp, useCurrentChallenge } from "../contexts"
import useSuggestion from "../hooks/useSuggestion"

import styled, { keyframes } from "styled-components"

export default () => {
  const history = useHistory()
  const location: any = useLocation<any>()
  const [currentRoute, setCurrentRoute] = useState<any>("")
  const { currentChallenge } = useCurrentChallenge()
  const { hasNotifiableSuggestion, hasTeamSuggestion } = useSuggestion()

  useEffect(() => {
    setCurrentRoute(location.pathname)
  }, [location.pathname])

  const onClickButton = (route) => {
    setCurrentRoute(route)
    history.push(route)
  }

  return (
    <IonFooter no-shadow>
      <TabBarContainer>
        <div className="content">
          <BarButton
            icon="home"
            title="Vestiaire"
            action={(active) => !active && onClickButton(ROUTES.HOME)}
            active={currentRoute === ROUTES.CHALLENGE}
            highlighted={!!hasNotifiableSuggestion}
          />
          <BarButton
            icon="team"
            highlighted={!!hasTeamSuggestion}
            title={currentChallenge.wording.tribe}
            action={(active) => !active && onClickButton(ROUTES.ACTIVE_CLUB)}
            active={currentRoute === ROUTES.ACTIVE_CLUB}
          />
          <BarButton
            icon="calendar"
            title="Calendrier"
            action={(active) =>
              currentRoute === ROUTES.CALENDAR ? onClickButton(ROUTES.CALENDAR_QUIZZES) : onClickButton(ROUTES.CALENDAR)
            }
            active={currentRoute === ROUTES.CALENDAR || currentRoute === ROUTES.CALENDAR_QUIZZES}
          />
          <BarButton
            icon="ranking"
            title="Classement"
            action={(active) => !active && onClickButton(ROUTES.ACTIVE_RANKING)}
            active={currentRoute === ROUTES.ACTIVE_RANKING}
          />
        </div>
      </TabBarContainer>
    </IonFooter>
  )
}

const TabBarContainer = styled(IonToolbar)`
  --background: ${(props) => props.theme.bg.secondary};
  filter: brightness(100%);
  div.content {
    width: 100%;
    padding: 5px 0;
    display: flex;
    flex-direction: row;
    text-align: center;
    align-content: stretch;
    z-index: 10;
    border-top: ${(props) => props.theme.bg.secondary};
  }
`

const BarButtonContainer = styled("button")`
  flex: 1;
  height: 100%;
  color: white;
  img {
    width: 32px;
    height: 32px;
    border-radius: 16px;
    display: inline-block;
    opacity: 0.5;
  }
  p {
    display: block;
    font-size: 12px;
    font-family: Montserrat, Verdana;
    font-weight: 400;
    color: ${(props) => props.theme.text.tertiary};
    text-transform: capitalize;
  }
  &.icon:before {
    height: 32px;
    display: inline-flex;
    padding-bottom: 6px;
    text-align: center;
    font-size: 32px;
    color: ${(props) => props.theme.icon.primary};
  }

  &.active {
    img {
      opacity: 1;
    }
    p {
      color: ${(props) => props.theme.icon.navigation};
    }
    &.icon:before {
      color: ${(props) => props.theme.icon.navigation};
    }
  }
  &.disabled {
    opacity: 0.3;
  }
`
const BarButton = ({
  icon,
  title = "",
  active = false,
  image = null,
  action,
  disabled = false,
  highlighted = false,
}) => {
  if (icon.includes(".") && !image) {
    image = require("../images/" + icon)
  }
  return (
    <BarButtonContainer
      onClick={() => (!disabled ? action(active) : null)}
      className={`${!image ? `icon icon-${icon}` : ""} ${active ? "active" : ""} ${disabled ? "disabled" : ""}`}
    >
      {highlighted && <NotificationBadge className="icon icon-dot" />}
      {image && <img src={image} />}
      <p>{title}</p>
    </BarButtonContainer>
  )
}

const activeKeyframe = keyframes`
  0%   {opacity: 1;}
  50%  {opacity: 0.1;}
  100% {opacity: 1;}
`

const NotificationBadge = styled.i`
  color: ${(props) => props.theme.secondary};
  font-size: 13px;
  margin: 0 5px 0 -10px;
  position: relative;
  bottom: 2px;
  animation: ${activeKeyframe} 2s 3s ease 3;
  top: 12px;
  position: absolute;
`
