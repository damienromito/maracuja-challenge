import React from "react"
import styled from "styled-components"

export default ({ tabsIds, tabsContent, setActiveId, activeId }) => {
  return (
    <TabMenuContainer>
      <div className="content">
        <BarButton action={() => setActiveId(tabsIds[0])} active={activeId === tabsIds[0]}>
          {" "}
          {tabsContent[0]}
        </BarButton>
        <BarButton action={() => setActiveId(tabsIds[1])} active={activeId === tabsIds[1]}>
          {tabsContent[1]}
        </BarButton>
      </div>
    </TabMenuContainer>
  )
}

const TabMenuContainer = styled.div`
  height: 60px;
  width: 100%;

  div.content {
    height: 60px;
    width: 100%;
    background-color: ${(props) => props.theme.bg.secondary};
    display: flex;
    flex-direction: row;
    text-align: center;
    align-content: stretch;
    z-index: 10;
    border-top: ${(props) => props.theme.bg.secondary};
  }
`

const BarButton = ({ children, active, action, disabled = false }) => {
  return (
    <BarButtonContainer
      onClick={() => (!disabled ? action() : null)}
      className={`${active ? "active" : ""} ${disabled ? "disabled" : ""}`}
    >
      {children}
    </BarButtonContainer>
  )
}

const BarButtonContainer = styled("button")`
  flex: 1;
  height: 100%;
  color: white;

  p {
    display: block;
    font-size: 12px;
    font-family: Montserrat, Verdana;
    text-transform: uppercase;
    font-weight: 400;
    color: ${(props) => props.theme.text.tertiary};
  }
  svg {
    height: 20px;
  }
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
  .icon {
    filter: opacity(30%);
  }
  &.active {
    img {
      opacity: 1;
    }
    p {
      color: ${(props) => props.theme.icon.navigation};
    }
    border-bottom: 1px solid #fff;
    .icon {
      filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(10deg) brightness(109%) contrast(102%);
    }
  }
  &.disabled {
    opacity: 0.3;
  }
`
