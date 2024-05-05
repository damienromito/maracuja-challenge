import React, { useEffect, useState } from "react"
import { useCurrentChallenge } from "../contexts"
import styled from "styled-components"
import CountDown from "./CountDown"
import TitleDate from "./TitleDate"
import { ACTIVITY_TYPES, ROLES } from "@maracuja/shared/constants"

const Container = styled.div`
  padding: 25px 15px 25px 15px;
  background: ${(props) => props.theme.bg.secondary};
  text-align: center;
  .title-date {
    color: ${(props) => props.theme.text.tertiary};
    margin-top: 5px;
  }
`

interface EventCountDownProps {
  text: string
  date: Date
}
const EventCountDown = ({ text, date }: EventCountDownProps) => {
  return (
    <Container>
      <TitleDate>{text}</TitleDate>
      <div style={{ height: 80 }}>
        <CountDown date={date} />
      </div>
    </Container>
  )
}
export default EventCountDown
