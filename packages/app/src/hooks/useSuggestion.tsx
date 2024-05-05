import { ACTIVITY_TYPES, PLAYER_ROLES, SUGGESTIONS_TYPES } from "@maracuja/shared/constants"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { useState } from "react"
import { getHiddenSuggestions } from "../utils/suggestions"

export default () => {
  const {
    currentQuestionSet,
    currentDebriefingContest,
    currentPlayer,
    currentChallenge,
    currentPhase,
    currentTeam,
    getNextQuestionSet,
    currentActivities,
    currentChallengeLoading,
  } = useCurrentChallenge()
  const [hiddenSuggestions, setHiddenSuggestions] = useState<any>(getHiddenSuggestions())

  const hideSuggestion = (suggestionId) => {
    const hiddenSug = getHiddenSuggestions()
    hiddenSug[suggestionId] = true
    setHiddenSuggestions({ ...hiddenSug })
    localStorage.setItem("hiddenSuggestions", JSON.stringify(hiddenSug))
  }

  const getSuggestedActivity = () => {
    if (!currentActivities) return null
    let currentActivity = null
    for (const activity of currentActivities) {
      if (!hiddenSuggestions[activity.id]) {
        currentActivity = activity
        break
      }
    }
    return currentActivity
  }

  const getSuggestedActivityId = () => {
    const activity = getSuggestedActivity()
    switch (activity?.type) {
      case ACTIVITY_TYPES.LOTTERY:
        return SUGGESTIONS_TYPES.LOTTERY
      case ACTIVITY_TYPES.EXTERNAL:
        return SUGGESTIONS_TYPES.EXTERNAL
      default:
        return null
    }
  }

  // useEffect(() => {

  let hasNotifiableSuggestion = false
  let hasTeamSuggestion = false
  // VESTIAIRE SUGGESTION
  hasNotifiableSuggestion = true

  const getSuggestion = () => {
    if (currentChallengeLoading || !currentPlayer || !currentChallenge) return null

    if (
      currentPlayer.hasRole(PLAYER_ROLES.CAPTAIN) &&
      currentPhase?.captainEditTeam.name &&
      currentTeam.hasDefautName()
    ) {
      return SUGGESTIONS_TYPES.TEAM_NAME
    }

    if (currentPlayer.hasRole(PLAYER_ROLES.CAPTAIN) && currentPhase?.captainEditTeam.logo && !currentTeam.logo) {
      return SUGGESTIONS_TYPES.TEAM_LOGO
    }

    if (currentQuestionSet && !currentQuestionSet.hasPlayed) return SUGGESTIONS_TYPES.CURRENT_QUIZ

    if (getSuggestedActivity()) return getSuggestedActivityId()

    if (
      currentDebriefingContest?.getIfDebriefingIsNeeded() &&
      currentDebriefingContest.getDebriefingProgression() < 1.0 &&
      currentDebriefingContest.phase.id === currentPhase?.id
    ) {
      return SUGGESTIONS_TYPES.DEBRIEFING
    }

    if (
      !currentPlayer.hasRole(PLAYER_ROLES.CAPTAIN) /*&& currentPlayer.receivePushNotifications()*/ &&
      (currentTeam.captainCount || 0) < currentChallenge.captains?.maxPerTeam &&
      !hiddenSuggestions[SUGGESTIONS_TYPES.BECOME_CAPTAIN]
    ) {
      return SUGGESTIONS_TYPES.BECOME_CAPTAIN
    }

    if (
      currentChallenge.icebreakerEnabled &&
      !currentPlayer.icebreaker?.questionCreationCount &&
      !hiddenSuggestions.icebreaker
    ) {
      return SUGGESTIONS_TYPES.ICEBREAKER
      // } else if (currentChallenge.emails?.mailingListEnabled && !currentPlayer.notifications?.email?.news && (currentQuestionSet ? currentQuestionSet?.hasPlayed : true) && !hiddenSuggestions.emailTips) {
      //   sug = SUGGESTIONS_TYPES.EMAIL_TIPS
    }

    const currentSurvey = currentChallenge.surveys?.getCurrent()
    if (currentSurvey && !hiddenSuggestions[currentSurvey.id]) {
      return SUGGESTIONS_TYPES.SURVEY
    }

    if (
      currentChallenge.onboarding?.needCaptain &&
      !currentPlayer.hasRole(PLAYER_ROLES.REFEREE) &&
      !currentTeam.captainCount &&
      !hiddenSuggestions.needCaptain
    ) {
      return SUGGESTIONS_TYPES.NEED_CAPTAIN
    }

    if (
      !currentPlayer.hasRole(PLAYER_ROLES.REFEREE) &&
      (currentChallenge.onboarding.playerCountMinimum || 0) > currentTeam.playerCount &&
      !hiddenSuggestions.playerCountMinimum
    ) {
      return SUGGESTIONS_TYPES.PLAYER_COUNT_MINIMUM
    }

    if (
      currentPhase &&
      !currentPlayer.avatar &&
      (!currentQuestionSet || currentQuestionSet?.hasPlayed) &&
      !hiddenSuggestions.playerCard
    ) {
      return SUGGESTIONS_TYPES.PLAYER_CARD
    }

    if (currentChallenge.ideasBoxes?.getCurrent()) {
      return SUGGESTIONS_TYPES.IDEAS_BOX
    }

    if (currentQuestionSet?.type === ACTIVITY_TYPES.TRAINING) {
      hasNotifiableSuggestion = false
      return SUGGESTIONS_TYPES.CURRENT_QUIZ
    }

    if (currentPhase && getNextQuestionSet()) {
      hasNotifiableSuggestion = false
      return SUGGESTIONS_TYPES.NEXT_QUIZ
    }

    hasNotifiableSuggestion = false
    const nextPhase = currentChallenge.getNextPhase()
    if (nextPhase) {
      return SUGGESTIONS_TYPES.NEXT_PHASE
    }

    if (currentChallenge.endDate < new Date()) {
      if (currentQuestionSet) return SUGGESTIONS_TYPES.CURRENT_QUIZ
      if (currentChallenge.nextChallenge) return SUGGESTIONS_TYPES.NEXT_CHALLENGE
      return SUGGESTIONS_TYPES.CHALLENGE_ENDED
    }
    return null
  }

  const sug = getSuggestion()
  return {
    currentSuggestion: sug,
    hideSuggestion,
    getSuggestedActivity,
    hiddenSuggestions,
    hasNotifiableSuggestion,
    hasTeamSuggestion,
  }
}
