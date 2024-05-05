import "firebase/firestore"
import { useState } from "react"
import { useRouteMatch } from "react-router-dom"
import Item from "./item"
let itemList = null

const StatsBase = ({ popupManager }) => {
  const match = useRouteMatch<any>()

  const [globalStats, setGlobalStats] = useState<any>(null)
  const [items, setItems] = useState<any>([])
  const [loading, setLoading] = useState<any>(false)

  // useEffect(() => {
  //   const unsubscribe = loadStats()

  //   return () => {
  //     unsubscribe()
  //   }
  // }, [])

  // const loadStats = () => {
  //   return ChallengeStats.fetchAll(
  //     {},
  //     {
  //       listener: (stats) => {
  //         setItems(stats)
  //       },
  //     }
  //   )
  // }

  // useEffect(() => {
  //   if (items.length > 0) {
  //     const unsubscribe = firebase
  //       .firestore()
  //       .doc("stats/global")
  //       .onSnapshot((snapshot) => {
  //         setGlobalStats({
  //           userCount: snapshot.data().userCount,
  //           playerCount: items.map((x) => x.playerCount).reduce((p, n, i) => (n ? p + n : p), 0),
  //           gameCount: items.map((x) => x.gameCount).reduce((p, n, i) => (n ? p + n : p), 0),
  //         })
  //       })

  //     return () => {
  //       unsubscribe()
  //     }
  //   }
  // }, [items])

  return (
    <div>
      <h1>Statistiques</h1>

      {globalStats && (
        <div className="row" style={{ textAlign: "center" }}>
          <div className="col s12 m4 l4">
            <h5>{globalStats.userCount || 0} </h5>
            <p>Utilisateurs</p>
          </div>
          <div className="col s12 m4 l4">
            <h5>{globalStats.playerCount || 0} </h5>
            <p>Participations</p>
          </div>
          <div className="col s12 m4 l4">
            <h5>{globalStats.gameCount || 0} </h5>
            <p>Parties</p>
          </div>
        </div>
      )}

      {items ? (
        <div>
          <h4>Challenges</h4>
          <ul
            className="collection"
            style={{ textAlign: "center" }}
            ref={(o) => {
              itemList = o
            }}
          >
            {items.map((item) => {
              return <Item key={item.id} item={item} />
            })}
          </ul>
        </div>
      ) : (
        <div>Il n'y a aucune tribu ...</div>
      )}
    </div>
  )
}

const condition = (authUser) => !!authUser

export default StatsBase
