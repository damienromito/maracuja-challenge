import { ACTIVITY_TYPES } from "@maracuja/shared/constants"
import ROLES from "@maracuja/shared/constants/roles"
import React from "react"
import { CountDown, TitleDate } from "../../components"
import { useApp, useCurrentChallenge } from "../../contexts"
import Suggestion from "./Suggestion"
import { RegularLink } from "@maracuja/shared/components"
import QuestionSet from "./QuestionSet"

export default () => {
  const { currentPlayer, currentPhase, getNextQuestionSet, currentQuestionSet } = useCurrentChallenge()
  const nextQuestionSet = getNextQuestionSet()
  const { currentSuggestion, hasNotifiableSuggestion } = useApp()

  const handleResetSuggestions = () => {
    localStorage.removeItem("hiddenSuggestions")
    window.location.reload()
  }

  return (
    <Suggestion>
      {currentPlayer.hasRole(ROLES.CAPTAIN) && currentPhase?.captainEditTeam.name && currentQuestionSet ? (
        <QuestionSet />
      ) : (
        <>
          <TitleDate>
            {nextQuestionSet.type === ACTIVITY_TYPES.CONTEST && "PROCHAINE ÉPREUVE DANS"}
            {nextQuestionSet.type === ACTIVITY_TYPES.TRAINING && "PROCHAIN ENTRAINEMENT DANS"}
          </TitleDate>
          <CountDown date={nextQuestionSet.startDate} />
        </>
      )}
      {currentSuggestion && !hasNotifiableSuggestion && (
        <RegularLink onClick={handleResetSuggestions}>Re-afficher les suggestions</RegularLink>
      )}
    </Suggestion>
  )
}
