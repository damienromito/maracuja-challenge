import { useCurrentChallenge } from "@maracuja/shared/contexts"
import { Game } from "@maracuja/shared/models"
import M from "materialize-css"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useDashboard } from "../../contexts"

export default ({ type, playerId, challengeId }) => {
  const { currentChallenge } = useCurrentChallenge()
  const { setLoading } = useDashboard()
  const [games, setGames] = useState<any>()
  useEffect(() => {
    const unsub = loadGames()
    return () => {
      unsub()
    }
  }, [])

  const loadGames = () => {
    return Game.fetchAll(
      { challengeId },
      {
        refHook: (ref) =>
          ref.orderBy("createdAt", "desc").where("player.id", "==", playerId).where("questionSet.type", "==", type),
        listener: (objects) => {
          setGames(objects)
        },
      }
    )
  }

  const handleDeleteGame = async (game) => {
    if (
      window.confirm(
        "Supprimer toutes les parties ? ⚠️Attention, cela permettra de rejouer mais pas de reinitialiser le score ?"
      ) === true
    ) {
      setLoading(true)
      await Game.delete({ challengeId: currentChallenge.id, id: game.id })
      M.toast({ html: "partie supprimée !" })
      setLoading(false)
    }
  }

  return !games ? null : (
    <div>
      {games.map((game) => {
        return (
          <div className="col s8 gray ligthen-2" key={game.id} style={{ border: "1px solid black", padding: 5 }}>
            <h4>{game.questionSet.name}</h4>
            <strong style={{ textTransform: "uppercase" }} />
            {game.questionSet.keepProgression ? <p>🔄 nouvelle tentative</p> : ""}
            {game.hasQuit && "⚠️ abandon"}
            <p>
              <a
                href={`https://console.firebase.google.com/u/0/project/maracuja-english-challenge/firestore/data/~2Fchallenges~2F${challengeId}~2Fgames~2F${game.id}`}
                target="_blanck"
              >
                Voir sur Firebase
              </a>
            </p>
            <p>
              <i className="left material-icons ">star</i> {game.score} POINTS ({game.correctCount}/{game.questionCount}
              ) {game.answerCount && `${game.answerCount} répondues`}
            </p>
            <p>
              <i className="left material-icons ">date_range</i> Joué le{" "}
              {moment(game.createdAt).format("DD MMM YYYY à H:mm:ss")}
            </p>
            {/* <p>timer :{game.duration}s {game.endOfTime && "(temps écoulé)-"}- {game.hasQuit && "Abandon -"}</p> */}
            <button onClick={() => handleDeleteGame(game)}>Supprimer la partie</button>
          </div>
        )
      })}
    </div>
  )
}
