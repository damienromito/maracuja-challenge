import React from 'react'
import { styled, color } from '../styles'

const ErrorLabelContainer = styled('p')`
  color : ${props => props.theme.text.error};
  padding: 10px 10px 4px 0px;
`
const ErrorLabel = ({ children }) => {
  if (children) {
    return <ErrorLabelContainer>{children}</ErrorLabelContainer>
  } else return null
}

export default ErrorLabel
