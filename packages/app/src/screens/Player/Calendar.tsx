import { IonContent } from "@ionic/react"
import { objectSubset } from "@maracuja/shared/helpers"
import "moment/locale/fr"
import React, { useEffect, useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { NavBar } from "../../components"
import { useCurrentChallenge } from "../../contexts"
import Months from "../Calendar/Months"

export default () => {
  const { currentQuestionSet, getPreviousQuestionSet, currentQuestionSets } = useCurrentChallenge()
  const history = useHistory()
  const location = useLocation<any>()
  const [player] = useState(location?.state?.player)
  const [score] = useState(location?.state?.score)
  const [defaultQuestionSetId] = useState(currentQuestionSet?.id || getPreviousQuestionSet().id)

  useEffect(() => {
    scrollToQuestionSet()
  }, [defaultQuestionSetId])

  const scrollToQuestionSet = () => {
    if (defaultQuestionSetId) {
      const yOffset = document.getElementById(defaultQuestionSetId)?.offsetTop - 100 || 0
      const content = document.querySelector("ion-content")
      content.scrollToPoint(0, yOffset, 0)
    }
  }

  const restrictedQuestionSets = currentQuestionSets?.filter((qs) => !qs.audienceRestricted) || []
  const userPhaseQuestionSets = restrictedQuestionSets.map((pQs) => {
    const userQs = player.questionSets?.[pQs.id]
    return {
      ...objectSubset(pQs, ["startDate", "type", "id"]), // enleve les proprieté liées au currentPlayer
      ...userQs,
    }
  })

  return (
    <>
      <NavBar title={`${player.username} : ${score} POINTS`} leftAction={() => history.goBack()} leftIcon="back" />

      <IonContent>
        <Months questionSets={userPhaseQuestionSets} />
      </IonContent>
    </>
  )
}
