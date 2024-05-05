import React from "react"
import styled from "styled-components"

const Wrapper = styled.div`
  flex: 1;
  text-align: center;
`
// interface DayProps {
//   dayRender?: (props: { date: Date }) => any
//   date?: Date
// }
interface DayProps {
  date?: Date
  dayRender?: (date: Date) => JSX.Element
  children?: any
}

export default ({ date, dayRender, children }: DayProps) => {
  return <Wrapper>{(date && dayRender?.(date)) || children}</Wrapper>
}
