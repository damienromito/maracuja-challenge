import styled from "styled-components"
import React from "react"
import { RegularLink } from "@maracuja/shared/components"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { useApp } from "../../contexts"
import useSuggestion from "../../hooks/useSuggestion"

export default ({ children, skipEnabled = false, suggestionId = undefined }) => {
  const { refreshCurrentChallenge } = useCurrentChallenge()
  const { openAlert, logEvent } = useApp()
  const { hideSuggestion } = useSuggestion()

  const handleHide = () => {
    handleHideSuggestion({ id: suggestionId, showDefaultPopup: true })
    refreshCurrentChallenge() // pour cacher la suggestion
  }

  const handleHideSuggestion = ({ id: suggestionId, title = undefined, message = undefined, showDefaultPopup }) => {
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

  return (
    <Wrapper>
      {children}
      {skipEnabled && <RegularLink onClick={handleHide}>Plus tard</RegularLink>}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: 15px;
  text-align: center;
  background: ${(props) => props.theme.bg.info};
  color: ${(props) => props.theme.text.secondary};
  .name {
    color: ${(props) => props.theme.text.secondary};
  }
  .regular-link {
    color: white !important;
  }
`
