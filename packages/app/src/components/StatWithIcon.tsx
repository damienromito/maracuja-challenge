import React from "react"
import { styled, size } from "../styles"

const Container = styled.div`
  color: ${(props) => props.theme.text.tertiary};
  margin-right: 8px;
  font-size: 15px;
  &:before {
    top: 2px;
    position: relative;
  }
`
const StatWithIcon = ({ children, icon = "" }) => {
  return <Container className={icon ? `icon icon-${icon}` : ""}>{children}</Container>
}
export default StatWithIcon
