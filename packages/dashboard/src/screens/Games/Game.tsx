import React, { Fragment } from "react"
import { Link } from "react-router-dom"
import moment from "moment"
import styled from "styled-components"
import { Activity } from "@maracuja/shared/models"
import { useAuthUser } from "@maracuja/shared/contexts"
import { USER_ROLES } from "../../constants"

// import M from "materialize-css";
// import {ConfirmModal} from '../../components'
const Container = styled.li`
  .row {
    margin: 0;
  }
`

const Game = ({ item, challengeId }) => {
  const { authUser } = useAuthUser()

  return (
    <Container className="collection-item">
      <div className="row">
        <div className="col s4">
          <h6>{item.questionSet.name}</h6>
          <strong style={{ textTransform: "uppercase" }}>
            {Activity.getTypeLabel({ type: item.questionSet.type })}
          </strong>
          {item.questionSet.keepProgression ? <p>🔄 nouvelle tentative</p> : ""}
          {authUser.hasRole(USER_ROLES.SUPER_ADMIN) && (
            <p>
              <a
                href={`https://console.firebase.google.com/u/0/project/maracuja-english-challenge/firestore/data/~2Fchallenges~2F${challengeId}~2Fgames~2F${item.id}`}
                target="_blanck"
              >
                Voir sur Firebase
              </a>
            </p>
          )}
          <p>
            <i className="left material-icons ">local_play</i>({item.correctCount}/{item.questionCount})
            {item.hasQuit && "⚠️ abandon"}
          </p>
        </div>

        <div className="col s4">
          {item.player && (
            <Link to={`/challenges/${challengeId}/players/${item.player.id}`} className="blue white-text">
              {item.player.username}{" "}
              {item.player.roles &&
                (item.player.roles.includes("REFEREE") ? "👶🏻" : item.player.roles.includes("CAPTAIN") && "✊")}
            </Link>
          )}
          <br />
          {item.team && (
            <>
              <Link to={`/challenges/${challengeId}/teams/${item.team.id}`} className="black white-text">
                {item.team.name}
              </Link>
            </>
          )}
        </div>

        <div className="col s4">
          <p>
            <i className="left material-icons ">access_time</i> {moment(item.createdAt).format("H:mm:ss")}
          </p>
          <p>
            <i className="left material-icons ">date_range</i>
            {moment(item.createdAt).format("DD MMM YYYY")}
          </p>
        </div>
      </div>
    </Container>
  )
}

export default Game
