import React from "react"
import styled from "styled-components"

const Button = styled("button")`
  min-width: 60px;
  /* height : 100%; */
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  &.icon:before {
    font-size: 25px;
  }
`

const NavBarButton = ({ action = null, icon = "", children = undefined }) => {
  return (
    <Button onClick={() => action && action()} className={icon ? `icon icon-${icon}` : ""}>
      {children}
    </Button>
  )
}

export default NavBarButton
