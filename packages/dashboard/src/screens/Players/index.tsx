import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { Player } from "@maracuja/shared/models"
import React, { useEffect, useState } from "react"
import { useRouteMatch } from "react-router-dom"
import Item from "./PlayerItem"

const ItemsBase = () => {
  const { currentPhase, currentChallenge } = useCurrentChallenge()
  const match = useRouteMatch<any>()

  const [items, setItems] = useState<any>([])
  const [loading, setLoading] = useState<any>(false)

  useEffect(() => {
    const unsub = loadPlayers()
    return () => {
      unsub()
    }
  }, [])

  const loadPlayers = () => {
    setLoading(true)
    return Player.fetchAll(
      { challengeId: match.params.challengeId },
      {
        refHook: (ref) => ref.orderBy("createdAt", "desc").limit(15),
        listener: (items) => {
          setLoading(false)
          setItems(items)
        },
      }
    )
  }

  return (
    items && (
      <div>
        <h5>
          {currentChallenge.name}({currentPhase && currentPhase.name})
        </h5>
        <h1>Players</h1>

        {loading && <div>Loading... </div>}
        {items && (
          <ul className="collection">
            {items.map((item) => {
              return <Item key={item.id} item={item} challengeId={match.params.challengeId} />
            })}
          </ul>
        )}
      </div>
    )
  )
}

export default ItemsBase
