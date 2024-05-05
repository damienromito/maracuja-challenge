import { Game } from "@maracuja/shared/models"
import React, { useEffect, useState } from "react"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import Item from "./Game"

const ItemsBase = ({ limit = 30, titleVisible = true, challengeId }) => {
  const { currentChallenge } = useCurrentChallenge()

  const [items, setItems] = useState<any>([])
  const [loading] = useState<any>(false)

  useEffect(() => {
    const unsubscribe = loadGames()
    return () => {
      unsubscribe()
    }
  }, [])

  const loadGames = () => {
    return Game.fetchAll(
      { challengeId: currentChallenge.id },
      {
        refHook: (ref) => ref.orderBy("createdAt", "desc").limit(limit),
        listener: (games) => {
          setItems(games)
        },
      }
    )
  }

  return (
    <div>
      {titleVisible && <h1>Games</h1>}

      {loading && <div>Loading... </div>}
      {items ? (
        <ul className="collection">
          {items.map((item) => (
            <Item key={item.id} item={item} challengeId={currentChallenge.id} />
          ))}
        </ul>
      ) : (
        <div>Il n'y a aucune partie ...</div>
      )}
    </div>
  )
}

export default ItemsBase
