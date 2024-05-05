import { useInterval } from "@maracuja/shared/hooks"
import moment from "moment"
import { useEffect, useState } from "react"
import styled from "styled-components"
import Text3 from "./Text3"

interface FixedContainerProps {
  fixed: boolean
}
const FixedContainer = styled.div<FixedContainerProps>`
  & > div {
    position: ${(props) => (props.fixed ? "fixed" : "relative")};
    width: 100%;
    z-index: 10;
  }
`
const Container = styled.div`
  background: ${(props) => props.theme.bg.tertiary};
  color: ${(props) => props.theme.text.primary};
  padding: 3px 0px;
  text-align: center;
  .text-3 {
    color: ${(props) => props.theme.text.tertiary};
    text-transform: uppercase;
  }
`

export default (props) => {
  const [weekPeriod, setWeekPeriod] = useState<string>("")

  useEffect(() => {
    updateComponent()
  }, [])

  useInterval(() => {
    updateComponent()
  }, 60000)

  const updateComponent = () => {
    const startOfWeek = moment().startOf("week").toDate()
    const endOfWeek = moment().endOf("week").toDate()
    const startMonth = moment(startOfWeek).format("MMM")
    const endMonth = moment(endOfWeek).format("MMM")
    const value = `SEMAINE ${moment(startOfWeek).format("DD")}${
      startMonth === endMonth ? "-" : " " + startMonth + " - "
    }${moment(endOfWeek).format("DD MMM")}`
    setWeekPeriod(value)
  }

  return (
    <FixedContainer {...props}>
      <Container>
        <Text3>{weekPeriod}</Text3>
      </Container>
    </FixedContainer>
  )
}
