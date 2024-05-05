import React from "react"
import { ConfirmModal } from "../../components"

const Tribe = ({ item, onDeleteItem = null }) => {
  // const {challengeId} = useCurrentChallenge()

  return (
    <li className="active grey lighten-2" style={{ listStyle: "none", height: 50 }}>
      <div className="right">
        {/* {challengeId &&
            <Link to={`/challenges/${challengeId}/teams/${item.id}`} className="black btn waves-effect waves-light">
              <i className=" left material-icons ">visibility</i>
            </Link>
          } */}

        {/* <button
          onClick={onClickEdit} className='btn grey darken-4
'
        >  <i className='tiny material-icons '>edit</i>
        </button> &nbsp; */}
        <ConfirmModal
          confirmAction={() => onDeleteItem(item.id)}
          trigger={
            <button
              className="btn grey darken-4
              "
              type="button"
            >
              <i className="tiny material-icons ">delete</i>
            </button>
          }
          title={`Supprimer le type de tribu ${item.name}`}
        />
      </div>
      <h6>
        <i className="tiny material-icons ">
          {item.challenges && Object.entries(item.challenges).length !== 0 && "check"}
        </i>
        {/* <img src={`file:///Users/damienromito/Documents/english-challenge-app/src/images/clubs/${item.image}`} /> */}
        {item.name}
        <span> ({item.id})</span>
      </h6>
    </li>
  )
}

export default Tribe
