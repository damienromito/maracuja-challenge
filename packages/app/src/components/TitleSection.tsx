import React from "react"

import styled from "styled-components"

const TitleContainer = styled.h2`
  text-transform: uppercase;
  font-size: 15px;
  margin: 15px 0;
  display: flex;
  align-items: center;
  position: relative;
  &:before {
    font-size: 26px;
    margin-right: 8px;
    color: ${(props) => props.theme.secondary};
    display: block;
  }
`
const TitleSection = ({ children }) => {
  /* className='icon icon-puce' */
  return <TitleContainer>{children}</TitleContainer>
}
export default TitleSection
