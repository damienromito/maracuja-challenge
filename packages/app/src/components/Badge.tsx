import React from "react"
import { size, styled } from "../styles"
import Text4 from "./Text4"

interface BadgeContainerProps {
  green: boolean
}

const BadgeContainer = styled(Text4)<BadgeContainerProps>`
  background: ${(props) => (props.green ? props.theme.icon.referee : props.theme.bg.info)};
  color: black;
  border-radius: ${size.borderRadius};
  padding: 0px 7px;
  margin-top: 3px;
  width: fit-content;
`
interface BadgeProps {
  green?: boolean
  children?: any
  style?: any
}
const Badge = ({ green, children, style }: BadgeProps) => {
  return (
    <BadgeContainer green={green} style={style} className="badge">
      {children}
    </BadgeContainer>
  )
}

export default Badge
