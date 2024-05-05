import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { Player } from "@maracuja/shared/models"
import React, { useEffect, useState } from "react"
import { useRouteMatch } from "react-router-dom"
import Item from "./PlayerItem"

const UserPage = () => {
  const { currentChallenge } = useCurrentChallenge()
  const match = useRouteMatch<any>()

  const [item, setItem] = useState<any>(null)

  useEffect(() => {
    const unsub = loadPlayer()
    return () => {
      unsub()
    }
  }, [])

  const loadPlayer = () => {
    return Player.fetch(
      { challengeId: currentChallenge.id, id: match.params.playerId },
      {
        listener: (object) => {
          setItem(object)
        },
      }
    )
  }
  return item ? (
    <div>
      <h1>{item.firstName}</h1>
      <Item item={item} details challengeId={match.params.challengeId} />
      <img src={item.image?.getUrl()} />
    </div>
  ) : (
    <div>Loading... </div>
  )
}
export default UserPage
