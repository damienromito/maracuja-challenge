import React from "react"
import styled, { keyframes } from "styled-components"
import { Text2 } from "."

export default (props) => {
  const { children } = props
  return (
    <>
      <FixedContainer {...props}>
        <Container>
          <Text2 className="active-phase-info icon icon-dot max-width-container">
            {children} <i className="icon-help" />
          </Text2>
        </Container>
      </FixedContainer>
    </>
  )
}

const activeKeyframe = keyframes`
  0%   {opacity: 1;}
  50%  {opacity: 0.1;}
  100% {opacity: 1;}
`
interface FixedContainerProps {
  fixed: boolean
}
const FixedContainer = styled.div<FixedContainerProps>`
  background-color: ${(props) => props.theme.bg.info};
  & > div {
    position: ${(props) => (props.fixed ? "fixed" : "relative")};
    width: 100%;
    z-index: 10;
  }
`
const Container = styled.div`
  color: black;
  padding: 3px 0px;
  text-align: center;
  .text-2.icon:before {
    color: ${(props) => props.theme.primary};
    font-size: 8px;
    margin: 0 5px 0 0;
    position: relative;
    bottom: 2px;
    animation: ${activeKeyframe} 2s 3s ease 3;
  }
`
