import { Link } from "react-router-dom"

const Tribe = ({ item }) => {
  // const {challengeId} = useCurrentChallenge()

  return (
    <li className="active grey lighten-2" style={{ listStyle: "none" }}>
      <h6>{item.name}</h6>
      <div className="row">
        <div className="col s12 m4 l4">
          <h5>{item.teamCount || 0} </h5>
          <Link to={`/challenges/${item.id}/teams`} className="btn black">
            Équipes
          </Link>
        </div>
        <div className="col s12 m4 l4">
          <h5>{item.playerCount || 0} </h5>
          <Link to={`/challenges/${item.id}/players`} className="btn blue">
            Joueurs
          </Link>
        </div>
        <div className="col s12 m4 l4">
          <h5>{item.gameCount || 0} </h5>
          <Link to={`/challenges/${item.id}/games`} className="btn  green waves-effect waves-light">
            Parties
          </Link>
        </div>
      </div>
    </li>
  )
}

export default Tribe
