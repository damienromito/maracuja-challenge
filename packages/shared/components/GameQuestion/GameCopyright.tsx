import React from 'react'
import styled from 'styled-components'
import Text3 from '../Text3'

const CopyrightContainer = styled(Text3)`
  display: block;
  text-align: right;
  margin-top : 8px;
  color:${props => props.theme.text.disabled};
`

const GameCopyright = ({ text }) => {
  return <CopyrightContainer>{text}</CopyrightContainer>
}

export default GameCopyright
