import React, { CSSProperties } from "react"
import styled from "styled-components"

const Wrapper = styled.p`
  color: ${(props) => props.theme.text.error};
  padding: 10px 10px 4px 0px;
`

interface ErrorLabelProps {
  children: JSX.Element
  style?: CSSProperties
}
export default ({ children, style }: ErrorLabelProps) => {
  return (
    <Wrapper style={style} className="error-label">
      {children}
    </Wrapper>
  )
}
