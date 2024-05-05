import React from "react"
import styled from "styled-components"

const LogoContainer = styled.div<{ small: boolean }>`
  text-align: center;
  display: inline-block;
  width: 100%;
  padding: ${(props) => (props.small ? "0px 4px" : "4px 8px")};
  font-size: ${(props) => (props.small ? "14px" : "18px")};
  background-color: ${(props) => props.theme.secondary};
  font-family: "Chelsea Market", Courier;
`

const LogoChallenge = (props) => {
  return (
    <LogoContainer {...props} className="logo-challenge">
      {props.title ? props.title : props.small ? "MARACUJA CHALLENGE" : "CHALLENGE"}
    </LogoContainer>
  )
}

export default LogoChallenge
