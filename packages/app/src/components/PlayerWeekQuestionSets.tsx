import { objectSubset } from "@maracuja/shared/helpers"
import moment from "moment"
import React from "react"
import styled from "styled-components"
import { useCurrentChallenge } from "../contexts"
import QuestionSetIcon from "@maracuja/shared/components/ActivityIcon/QuestionSetIcon"

export default ({ user }) => {
  const { currentQuestionSets } = useCurrentChallenge()

  const phaseQuestionSets =
    currentQuestionSets?.filter(
      (qs) => stateDateIsInCurrentWeek(qs) && !qs.audienceRestricted
    ) || []
  const userPhaseQuestionSets = phaseQuestionSets.map((pQs) => {
    const userQs = user.questionSets?.[pQs.id]
    return {
      ...objectSubset(pQs, ["startDate", "type", "id"]), // enleve les proprieté liées au currentPlayer
      ...userQs,
    }
  })

  const weekDays = [1, 2, 3, 4, 5, 6, 0]

  return (
    <Wrapper>
      {weekDays.map((dayNumber) => {
        const dayQuiz = userPhaseQuestionSets.find((qs) => {
          return qs.startDate.getDay() === dayNumber
        })
        if (dayQuiz) {
          return (
            <QuestionSetIcon
              questionSet={dayQuiz}
              key={`qs-${dayQuiz.id}`}
              style={{ width: 25, height: 25 }}
            />
          )
        } else {
          return (
            <EmptyDay
              key={`day-${dayNumber}`}
              className="icon icon-dot max-width-container"
            />
          )
        }
      })}
    </Wrapper>
  )
}

const stateDateIsInCurrentWeek = (dateObject) => {
  const startOfWeek = moment().startOf("week").toDate()
  const endOfWeek = moment().endOf("week").toDate()
  if (dateObject.startDate > startOfWeek && dateObject.startDate < endOfWeek)
    return true
  return false
}

const Wrapper = styled.div`
  display: flex;
  position: relative;
  .question-set-icon {
    margin-right: 0px;
    width: 25px;
    height: 25px;
  }
`

const EmptyDay = styled.div`
  width: 25px;
  height: 25px;
  text-align: center;
  &.icon:before {
      color:rgba(0,0,0,0.5)!important;
      font-size: 8px;import { objectSubset } from '@maracuja/shared/helpers';

      position:relative;
      bottom:2px;
      top: 0px;
  }
`
