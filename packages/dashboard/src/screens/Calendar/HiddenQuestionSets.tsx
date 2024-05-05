import { QuestionSet } from "@maracuja/shared/models"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDashboard } from "../../contexts"
import QuestionSetItem from "../QuestionSets/QuestionSetItem"
import SpreadSheetSyncMenu from "./SpreadSheetSyncMenu"

export default ({ item, onClickEdit, onSubmited }) => {
  const [questionSets, setQuestionSets] = useState<any>([])
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
          return ref.orderBy("startDate", "asc").where("disabled", "==", true)
        },
        listener: (items) => {
          setQuestionSets(items || [])
          setLoading(false)
        },
      }
    )
  }

  return (
    <div>
      <SpreadSheetSyncMenu />
      <h4>Bibliotheque de contenu</h4>
      <p>Tous les quiz desactivés apparaitront dans cette bibliotheque </p>
      <div>
        <ul className="collapsible">
          {questionSets?.map((qs) => {
            return <QuestionSetItem item={qs} key={qs.id} phase={item} />
          })}
        </ul>
      </div>
    </div>
  )
}
