import { ACTIVITY_TYPES } from "@maracuja/shared/constants"
import moment from "moment"
import "moment/locale/fr"
import React, { useEffect } from "react"
import styled from "styled-components"
import { Calendar, CalendarWeekDays, QuestionSetIcon, Text3 } from "../../components"
import { useCurrentChallenge } from "../../contexts"
import { useRouteMatch } from "react-router-dom"
import { CALENDAR } from "../../constants/routes"

export default ({ onClickDay = undefined, questionSets = undefined }) => {
  const { currentChallenge, currentPhase, currentQuestionSets, currentPlayer } = useCurrentChallenge()
  const now = new Date()
  const playerId = useRouteMatch<any>()?.params?.playerId

  let isCurrentPlayer
  if (!playerId || playerId === currentPlayer.id) {
    questionSets = currentQuestionSets
    isCurrentPlayer = true
  }

  return (
    <>
      <CalendarWeekDaysWrapper />

      <CalendarWrapper
        startDate={currentChallenge.startDate}
        endDate={currentChallenge.endDate}
        monthHeaderRender={({ monthNumber }) => {
          return <MonthHeader key={`header-${monthNumber}`}>{moment(monthNumber + 1, "M").format("MMMM")}</MonthHeader>
        }}
        dayRender={(date) => {
          const isTrainingAction = currentChallenge.isTrainingActionDate(date)

          const questionSet = questionSets?.find((qs) => moment(qs.startDate).isSame(date, "days"))
          const isToday = moment(date).isSame(now, "days")
          const isActive = isCurrentPlayer && questionSet?.getIsActive()
          let buttonClass
          const isInCurrentPhase =
            currentPhase &&
            moment(currentPhase.startDate).isSameOrBefore(date, "day") &&
            moment(currentPhase.endDate).isSameOrAfter(date, "day")

          if (isActive) {
            if (questionSet.type === ACTIVITY_TYPES.TRAINING) {
              buttonClass = questionSet.hasPlayed ? "secondary" : "primary"
            } else if (!questionSet.hasPlayed) {
              buttonClass = "primary"
            }
          }

          const handleOnClick = () => {
            // if (isActive || (questionSet && authUser.hasRole(USER_ROLES.ADMIN))) {
            if (isActive || questionSet) {
              onClickDay && onClickDay({ questionSetId: questionSet.id })
            }
          }

          return (
            <Day id={questionSet?.id || ""} className={isInCurrentPhase ? "currentPhase" : ""} onClick={handleOnClick}>
              <ButtonZone className={`${buttonClass} ${isActive ? "active" : ""}`}>
                <DayNumber className={isToday ? "today" : ""}>{moment(date).format("D")}</DayNumber>
                {questionSet && <QuestionSetIcon questionSet={questionSet} key={`qs-${questionSet.id}`} />}
                {isTrainingAction && (
                  <TrainingActionIcon>{currentChallenge.trainingActions?.label || "Formation"}</TrainingActionIcon>
                )}
              </ButtonZone>
            </Day>
          )
        }}
      />
    </>
  )
}

const TrainingActionIcon = styled.div`
  background: white;
  font-size: 8px;
  padding: 0 3px;
  margin: auto;
  max-width: 60px;
  color: black;
  position: relative;
`
const CalendarWeekDaysWrapper = styled(CalendarWeekDays)`
  background: ${(props) => props.theme.bg.tertiary};
  padding: 8px 16px;
  .day {
    color: rgba(255, 255, 255, 0.15);
  }
`
const CalendarWrapper = styled(Calendar)`
  margin: 16px;
`
const MonthHeader = styled(Text3)`
  font-weight: bold;
  text-transform: capitalize;
  margin: 16px 0px 8px 0px;
`

const Day = styled.div`
  height: 65px;
  .question-set-icon {
    margin-top: 2px;
  }
  padding: 5px;
  &.currentPhase {
    background: ${(props) => props.theme.bg.secondary};
  }
`
const ButtonZone = styled.div`
  &.active {
    cursor: pointer;
  }
  &.primary {
    background: ${(props) => props.theme.secondary};
  }
  &.secondary {
    background: ${(props) => props.theme.button.secondary};
  }
  border-radius: 8px;
  height: 100%;
`
const DayNumber = styled.span`
  font-size: 12px;
  color: ${(props) => props.theme.text.primary_alpha50};
  &.today {
    color: white;
    font-weight: bold;
  }
`
