import { useAuthUser } from "@maracuja/shared/contexts"
import { Team } from "@maracuja/shared/models"
import React, { useEffect, useState } from "react"
import { Button, Modal } from "react-materialize"

import { useRouteMatch } from "react-router-dom"
import { USER_ROLES } from "../../constants"
import TeamForm from "./TeamCreation"
import TeamGenerator from "./TeamGenerator"
import Item from "./TeamItem"

export default () => {
  const match = useRouteMatch<any>()
  const [items, setItems] = useState<any>(null)
  const { authUser } = useAuthUser()

  useEffect(() => {
    const unsubscribe = loadTeams()
    return () => {
      unsubscribe()
    }
  }, [])

  const loadTeams = () => {
    return Team.fetchAll(
      { challengeId: match.params.challengeId },
      {
        refHook: (ref) => ref.limit(15),
        listener: (teams) => {
          setItems(teams)
        },
      }
    )
  }

  return (
    <div>
      <h1>Équipes</h1>
      {authUser.hasRole(USER_ROLES.SUPER_ADMIN) && <NewButton />}
      {items?.length && (
        <ul className="collection">
          {items.map((item) => (
            <Item key={item.id} item={item} />
          ))}
        </ul>
      )}
    </div>
  )
}

const NewButton = () => {
  const [isModalOpen, setIsModalOpen] = useState<any>(false)

  const handleSaveEnded = () => {
    setIsModalOpen(false)
  }
  return (
    <Modal
      options={{
        onOpenEnd: () => {
          setIsModalOpen(true)
        },
        // onCloseEnd: onCloseModal
      }}
      open={isModalOpen}
      header="Nouvelle Equipe"
      trigger={<Button className="red darken-4">Créer une équipe</Button>}
    >
      {/* {isModalOpen &&
        <TeamForm onSaveEnded={handleSaveEnded} />} */}
      {isModalOpen && <TeamGenerator onSaveEnded={handleSaveEnded} />}
    </Modal>
  )
}
