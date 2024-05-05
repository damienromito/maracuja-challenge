import { objectSubset } from "@maracuja/shared/helpers"
import moment from "moment"
import React from "react"
import styled from "styled-components"
import { useCurrentChallenge } from "../contexts"
import QuestionSetIcon from "@maracuja/shared/components/ActivityIcon/QuestionSetIcon"

export default ({ user }) => {
  const { currentQuestionSets, currentPhase, currentChallenge } = useCurrentChallenge()

  const displayedPhase = currentPhase || currentChallenge.getPreviousPhase()
  if (!displayedPhase) return null
  const phaseQuestionSets = currentQuestionSets?.filter((qs) => !qs.audienceRestricted) || []
  const userPhaseQuestionSets = []
  phaseQuestionSets.map((questionSet) => {
    if (questionSet.phase.id !== displayedPhase.id) return null
    const userQs = user.questionSets?.[questionSet.id]
    const phaseQuestionSet = {
      ...objectSubset(questionSet, ["startDate", "type", "id"]), // enleve les proprieté liées au currentPlayer
      ...userQs,
    }
    userPhaseQuestionSets.push(phaseQuestionSet)
  })

  return (
    <Wrapper>
      {userPhaseQuestionSets.map((qs) => {
        return <QuestionSetIcon questionSet={qs} key={`qs-${qs.id}`} style={{ width: 25, height: 25 }} />
      })}
    </Wrapper>
  )
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
