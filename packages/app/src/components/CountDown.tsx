import React, { useState, useEffect, useRef } from "react"
import moment, { Duration } from "moment"
import { currentDate } from "../utils/helpers"

import styled from "styled-components"
import { useInterval } from "../hooks"

interface CountDownProps {
  date: Date
  inline?: boolean
  prefix?: string
}
export default ({ date, inline, prefix = "" }: CountDownProps) => {
  const [countDown, setCountDown] = useState<Duration>(undefined)
  const eventTime = useRef(0)

  useEffect(() => {
    eventTime.current = moment(date).unix()
    updateCountDown()
  }, [])

  useInterval(() => {
    updateCountDown()
  }, 1000)

  const updateCountDown = () => {
    const date = currentDate()
    const currentTime = moment(date.getTime()).unix()
    const duration = moment.duration((eventTime.current - currentTime) * 1000, "milliseconds")
    const durationMilli = moment.duration(duration.asMilliseconds())
    setCountDown(durationMilli)
  }
  return countDown ? (
    <CountDownContainer className={`count-down ${inline ? "" : "block"}`}>
      {prefix && <span>{prefix}&nbsp;</span>}
      {countDown.months() > 0 && (
        <div className="item">
          <strong>{countDown.months()}</strong>
          <span>mois</span>
        </div>
      )}
      {(countDown.months() > 0 || countDown.days() > 0) && (
        <div className="item">
          <strong>{countDown.days()}</strong>
          <span>jours</span>
        </div>
      )}

      <div className="item">
        <strong>{countDown.hours()}</strong>
        <span>heures</span>
      </div>

      <div className="item">
        <strong>{countDown.minutes()}</strong>
        <span>minutes</span>
      </div>
      <div className="item">
        <strong>{countDown.seconds()}</strong>
        <span>secondes</span>
      </div>
      {/* {countDown.hours() < 1 && */}
      {/* } */}
    </CountDownContainer>
  ) : null
}

const CountDownContainer = styled.div`
  display: inline;
  .item {
    display: inline;
  }
  span,
  strong {
    padding-right: 4px;
    font-size: 15px;
    /* color : ${(props) => props.theme.bg.tertiary} */
  }
  &.block {
    height: 70px;
    display: inline-flex;
    flex-direction: row;
    width: 300px;
    justify-content: space-around;
    align-self: center;
    .item {
      display: flex;
      flex-direction: column;
    }
    strong {
      font-size: 42px;
      font-family: Montserrat, Verdana;
      font-weight: 600;
    }
    span {
      font-size: 13px;
      text-transform: uppercase;
    }
  }
`
