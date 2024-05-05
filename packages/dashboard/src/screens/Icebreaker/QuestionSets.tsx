import { ACTIVITY_TYPES } from "@maracuja/shared/constants"
import { QuestionSet } from "@maracuja/shared/models"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDashboard } from "../../contexts"
import QuestionSetItem from "../QuestionSets/QuestionSetItem"

export default ({ item }) => {
  const [questionSets, setQuestionSets] = useState<any>()
  const { setLoading } = useDashboard()
  const { challengeId } = useParams<any>()

  useEffect(() => {
    setLoading(true)
    const unsubscribe = loadQuestionSets()
    return () => {
      unsubscribe()
    }
  }, [])

  const loadQuestionSets = () => {
    return QuestionSet.fetchAll(
      { challengeId },
      {
        refHook: (ref) => {
          return ref.orderBy("startDate", "asc").where("type", "==", ACTIVITY_TYPES.ICEBREAKER)
        },
        listener: (items) => {
          setQuestionSets(items)
          setLoading(false)
        },
      }
    )
  }

  return (
    <div>
      <h4>Icebreaker Quiz </h4>
      <ul className="collapsible">
        {questionSets &&
          questionSets.map((qs) => {
            return <QuestionSetItem item={qs} key={qs.id} phase={item} />
          })}
      </ul>
    </div>
  )
}
