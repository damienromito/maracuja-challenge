import React, { useMemo } from "react"
import styled from "styled-components"
import { PLAYER_ROLES } from "@maracuja/shared/constants"
import UserIcon from "./UserIcon"

export default ({ role = undefined, isCurrentUser = false, size = 40, number = null, isInTopPlayers = false }) => {
  const iconName = useMemo(() => {
    if (role === PLAYER_ROLES.REFEREE) return "referee"
    else if (role === PLAYER_ROLES.CAPTAIN) return "captain"
    else if (role === PLAYER_ROLES.COACH) return "coach"
    return "shirt"
  }, [])

  return (
    <PlayerContainer
      // roles={roles}
      size={size}
      className={`user-avatar 
        ${isCurrentUser && "currentUser"}
      `}
    >
      <IconWrapper name={iconName} size={size} highlighted={isInTopPlayers} />
      {number && <div className="number">{number}</div>}
    </PlayerContainer>
  )
}

const IconWrapper = styled(UserIcon)`
  svg {
    fill: ${(props) => (props.highlighted ? "white" : props.theme.icon.primary)};
  }
`

const PlayerContainer = styled.div<{ size: number }>`
  display: flex;
  align-items: center;
  text-align: center;

  .number {
    position: absolute;
    font-family: Montserrat;
    font-weight: 600;
    font-size: 10px;
    color: #000000;
    width: ${(props) => props.size + "px"};
  }
`
