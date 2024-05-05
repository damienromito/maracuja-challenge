import { Icon } from "@maracuja/shared/components"
import React from "react"
import styled from "styled-components"

export default ({ size, children, locked, className = null }) => {
  return (
    <ActivityIconWrapper size={size} className={`${className || ""} activity-icon`}>
      {locked && size > 30 && (
        <Locker size={size}>
          <Icon name="lock" width={10} height={10} />
        </Locker>
      )}
      {children}
    </ActivityIconWrapper>
  )
}

interface ActivityIconWrapperProps {
  size: number
}

const ActivityIconWrapper = styled.div<ActivityIconWrapperProps>`
  width: 100%;
  position: relative;
  height: ${(props) => props.size + "px"};

  svg {
    width: ${(props) => props.size + "px"};
    height: ${(props) => props.size + "px"};
  }
`

interface LockerProps {
  size: number
}
const Locker = styled.div<LockerProps>`
  color: black;
  z-index: 2;
  position: absolute;
  width: 100%;
  top: ${(props) => props.size / 2 + "px"};
  left: ${(props) => props.size / 3 + "px"};
  svg {
    width: ${(props) => props.size / 2 + "px"};
    height: ${(props) => props.size / 2 + "px"};
  }
`
