import { SUGGESTIONS_TYPES } from "@maracuja/shared/constants"
import React from "react"
import { useHistory } from "react-router-dom"
import { Button } from "../../components"
import ROUTES from "../../constants/routes"
import { useCurrentChallenge } from "../../contexts"
import Suggestion from "./Suggestion"
import { capitalizeFirstLetter } from "@maracuja/shared/helpers"

export default () => {
  const { currentChallenge } = useCurrentChallenge()
  const history = useHistory()
  return (
    <Suggestion suggestionId={SUGGESTIONS_TYPES.TEAM_LOGO}>
      <p>{capitalizeFirstLetter(currentChallenge.wording?.captain)}, choisis maintenant un logo d’équipe</p>
      <Button onClick={() => history.push(`${ROUTES.EDIT_ACTIVE_CLUB}/logo`)}>Choisir un logo d’équipe</Button>
    </Suggestion>
  )
}
