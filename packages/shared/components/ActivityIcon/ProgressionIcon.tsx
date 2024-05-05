import React from "react"
import styled from "styled-components"
import ActivityIcon from "."

export default ({ progression, locked, icon, size }) => {
  return (
    <Wrapper size={size} progression={progression} locked={locked}>
      <div className="backgroundIcon">{icon}</div>
      <div className="progressionIcon">{icon}</div>
    </Wrapper>
  )
}

interface WrapperProps {
  progression: number
}
const Wrapper = styled(ActivityIcon)<WrapperProps>`
  .backgroundIcon {
    svg {
      bottom: 0;
      left: 0;
      position: absolute;
      width: 100%;
    }
    .icon {
      fill: ${(props) => props.theme.icon.disabled};
    }
  }
  .progressionIcon {
    width: 100%;
    height: ${(props) => props.size * props.progression + "px"};
    overflow: hidden;
    z-index: 1;
    bottom: 0;
    position: absolute;
    svg {
      bottom: 0;
      left: 0;
      position: absolute;
      width: 100%;
    }
    .icon {
      fill: ${(props) =>
        props.progression !== null
          ? props.progression === 1
            ? props.theme.icon.completed
            : props.theme.icon.inProgress
          : props.theme.icon.disabled};
    }
  }
`
