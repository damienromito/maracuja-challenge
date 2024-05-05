import { SUGGESTIONS_TYPES } from "@maracuja/shared/constants"
import React from "react"
import { RegularLink } from "../../components"
import { useApp, useCurrentChallenge } from "../../contexts"
import useSuggestion from "../../hooks/useSuggestion"
import BecomeCaptain from "./BecomeCaptain"
import ChallengeEnded from "./ChallengeEnded"
import Debriefing from "./Debriefing"
import EmailTipsSuggestion from "./EmailTipsSuggestion"
import ExternalActivities from "./ExternalActivities"
import Icebreaker from "./Icebreaker"
import IdeasBoxSuggestion from "./IdeasBox"
import Lotteries from "./Lotteries"
import NeedCaptain from "./NeedCaptain"
import NextPhase from "./NextPhase"
import NextQuiz from "./NextQuiz"
import PlayerCard from "./PlayerCard"
import PlayerCountMinimum from "./PlayerCountMinimum"
import QuestionSet from "./QuestionSet"
import Suggestion from "./Suggestion"
import Surveys from "./Surveys"
import TeamLogo from "./TeamLogo"
import TeamName from "./TeamName"
import UserFeedback from "./UserFeedback"
import NextChallenge from "./NextChallenge"

export default () => {
  const { openAlert, logEvent } = useApp()
  const { hideSuggestion, currentSuggestion, getSuggestedActivity } = useSuggestion()
  const { currentChallenge } = useCurrentChallenge()

  const handleHideSuggestion = ({ id: suggestionId, title, message, showDefaultPopup }) => {
    const hide = () => {
      hideSuggestion(suggestionId)
      logEvent(`hide_suggestion_${suggestionId}`)
    }

    if (showDefaultPopup || title) {
      openAlert({
        title: title || "Masquer ?",
        message: message || "Cette suggestion ne sera plus visible",
        buttons: [
          "Annuler",
          {
            text: "OK",
            handler: () => hide(),
          },
        ],
      })
    } else {
      hide()
    }
  }

  const SkipSuggestionButton = (params) => {
    return <RegularLink onClick={() => handleHideSuggestion(params)}>Masquer</RegularLink>
  }
  const displaySuggestion = (sug) => {
    switch (sug) {
      case SUGGESTIONS_TYPES.BECOME_CAPTAIN:
        return (
          <Suggestion>
            <BecomeCaptain onSuggestionHidden={handleHideSuggestion} />
            <SkipSuggestionButton id={SUGGESTIONS_TYPES.BECOME_CAPTAIN} showDefaultPopup />
          </Suggestion>
        )
      case SUGGESTIONS_TYPES.CHALLENGE_ENDED:
        return (
          <Suggestion>
            <ChallengeEnded />
          </Suggestion>
        )
      case SUGGESTIONS_TYPES.CURRENT_QUIZ:
        return (
          <Suggestion>
            <QuestionSet />
          </Suggestion>
        )
      // case SUGGESTIONS_TYPES.EMAIL_TIPS:
      //   return <EmailTipsSuggestion onSuggestionHidden={handleHideSuggestion} />
      case SUGGESTIONS_TYPES.NEXT_PHASE:
        return <NextPhase />
      case SUGGESTIONS_TYPES.DEBRIEFING:
        return (
          <Suggestion>
            <Debriefing />
          </Suggestion>
        )
      case SUGGESTIONS_TYPES.EXTERNAL:
        return (
          <Suggestion>
            <ExternalActivities externalActivity={getSuggestedActivity()} onSuggestionHidden={handleHideSuggestion} />
          </Suggestion>
        )
      case SUGGESTIONS_TYPES.FEEDBACK:
        return (
          <Suggestion>
            <UserFeedback />
          </Suggestion>
        )
      case SUGGESTIONS_TYPES.IDEAS_BOX:
        return (
          <Suggestion>
            <IdeasBoxSuggestion ideasBox={currentChallenge.ideasBoxes.getCurrent()} />
          </Suggestion>
        )
      case SUGGESTIONS_TYPES.ICEBREAKER:
        return (
          <Suggestion>
            <Icebreaker onSuggestionHidden={handleHideSuggestion} />
          </Suggestion>
        )
      case SUGGESTIONS_TYPES.LOTTERY:
        return (
          <Suggestion>
            <Lotteries lottery={getSuggestedActivity()} />
          </Suggestion>
        )
      case SUGGESTIONS_TYPES.NEED_CAPTAIN:
        return <NeedCaptain onSuggestionHidden={handleHideSuggestion} />
      case SUGGESTIONS_TYPES.NEXT_QUIZ:
        return <NextQuiz />
      case SUGGESTIONS_TYPES.NEXT_CHALLENGE:
        return <NextChallenge />
      case SUGGESTIONS_TYPES.PLAYER_COUNT_MINIMUM:
        return <PlayerCountMinimum onSuggestionHidden={handleHideSuggestion} />
      case SUGGESTIONS_TYPES.PLAYER_CARD:
        return <PlayerCard onSuggestionHidden={handleHideSuggestion} />
      case SUGGESTIONS_TYPES.PLAYER_CARD:
        return <PlayerCard onSuggestionHidden={handleHideSuggestion} />
      case SUGGESTIONS_TYPES.SURVEY:
        return (
          <Suggestion>
            <Surveys survey={currentChallenge.surveys?.getCurrent()} onSuggestionHidden={handleHideSuggestion} />
          </Suggestion>
        )
      case SUGGESTIONS_TYPES.TEAM_LOGO:
        return <TeamLogo />
      case SUGGESTIONS_TYPES.TEAM_NAME:
        return <TeamName />
      default:
        return null
    }
  }

  return displaySuggestion(currentSuggestion)
}
