// NOT USE

import { useAuthUser, useCurrentChallenge } from "@maracuja/shared/contexts"
import { QuestionSet } from "@maracuja/shared/models"
import M from "materialize-css"
import React, { useEffect, useState } from "react"
import { Button, Modal } from "react-materialize"
import { useRouteMatch } from "react-router-dom"
import { USER_ROLES } from "../../constants"
import QuestionSetForm from "./QuestionSetForm"
import QuestionSetItem from "./QuestionSetItem"

export default () => {
  const { currentChallenge } = useCurrentChallenge()
  const match = useRouteMatch<any>()
  const { authUser } = useAuthUser()

  const phase = currentChallenge.phases.find((phase) => phase.id === match.params.phaseId)

  const [isModalOpen, setIsModalOpen] = useState<any>(false)
  const [items, setItems] = useState<any>([])
  const [loading, setLoading] = useState<any>(false)
  const [nextEndDate, setNextEndDate] = useState<any>(phase.endDate)
  const [nextStartDate, setNextStartDate] = useState<any>(phase.startDate)

  const { challengeId } = match.params
  const itemList = null

  useEffect(() => {
    M.Collapsible.init(itemList, {})
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
          ref = ref.orderBy("startDate", "asc")
          return match.params.phaseId ? ref.where("phaseId", "==", match.params.phaseId) : ref
        },
        listener: (items) => {
          const lastItem = items[items.length - 1]
          const sDate = lastItem.startDate
          sDate.setDate(sDate.getDate() + 1)
          setNextStartDate(sDate)
          const eDate = lastItem.endDate
          eDate.setDate(eDate.getDate() + 1)
          setNextEndDate(eDate)
          setItems(items)
          setLoading(false)
        },
      }
    )
  }

  return (
    <div>
      <h3>Les Quiz</h3>
      <Modal
        header="Nouveau quiz"
        trigger={<Button className="green">Nouveau quiz</Button>}
        options={{
          onOpenEnd: () => {
            setIsModalOpen(true)
          },
        }}
        open={isModalOpen}
      >
        {isModalOpen && (
          <QuestionSetForm
            phase={phase}
            nextStartDate={nextStartDate}
            nextEndDate={nextEndDate}
            onSubmited={() => setIsModalOpen(false)}
          />
        )}
      </Modal>

      {loading && <div>Loading... </div>}
      {items ? (
        <ul
          className="collapsible"
          ref={(itemList) => {
            itemList = itemList
          }}
        >
          {items.map((item) => {
            return <QuestionSetItem key={item.id} phase={phase} item={item} />
          })}
        </ul>
      ) : (
        <div>Il n'y a aucun quiz ...</div>
      )}
    </div>
  )
}
