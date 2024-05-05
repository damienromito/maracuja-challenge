import { ACTIVITY_TYPES } from "@maracuja/shared/constants"
import React from "react"
import ContestIcon from "./ContestIcon"
import TrainingIcon from "./TrainingIcon"

export default ({ questionSet = undefined, large = false, onClick = undefined, style = {}, size = 0 }) => {
  const locked = !!questionSet.startDate && questionSet.startDate > new Date()

  return (
    <div className="question-set-icon" onClick={onClick} style={style}>
      {questionSet.type === ACTIVITY_TYPES.CONTEST && (
        <ContestIcon
          debriefed={
            questionSet._stats?.debriefingProgression === 1 ||
            questionSet._stats?.score === questionSet._stats?.questionCount
          }
          score={questionSet._stats?.score}
          large={large}
          size={size}
          locked={locked}
        />
      )}
      {questionSet.type === ACTIVITY_TYPES.TRAINING && (
        <TrainingIcon progression={questionSet._stats?.progression} large={large} size={size} locked={locked} />
      )}
    </div>
  )
}
