import React, { useState, useContext } from "react"
import { ConfirmModal } from "../../components"
import { Link } from "react-router-dom"
import { useCurrentChallenge } from "@maracuja/shared/contexts"

const Club = ({ item, onClickEdit, onDeleteItem }) => {
  const { currentChallenge } = useCurrentChallenge()

  return (
    <li className="active grey lighten-2" style={{ listStyle: "none" }}>
      <div className="right">
        {/* {challengeId &&
            <Link to={`/challenges/${challengeId}/teams/${item.id}`} className="black btn waves-effect waves-light">
              <i className=" left material-icons ">visibility</i>
            </Link>
          } */}
        <button
          onClick={onClickEdit}
          className="btn grey darken-4
"
        >
          {" "}
          <i className="tiny material-icons ">edit</i>
        </button>{" "}
        &nbsp;
        <ConfirmModal
          confirmAction={() => onDeleteItem(item)}
          trigger={
            <button
              className="btn grey darken-4
              "
              type="button"
            >
              <i className="tiny material-icons ">delete</i>
            </button>
          }
          title={`Supprimer le club ${item.name}`}
        />
      </div>
      <h6>
        <i className="tiny material-icons ">
          {item.challenges && Object.entries(item.challenges).length != 0 && "check"}
        </i>
        {/* <img src={`file:///Users/damienromito/Documents/english-challenge-app/src/images/clubs/${item.image}`} /> */}

        {item.name}
        <span> ({item.id})</span>
        <br />
        <span>
          {item.city || ""} {item.zipCode || item.departmentCode || ""} ({item.tribeId || ""})
        </span>
        <br />
        {currentChallenge && (
          <Link to={`/challenges/${currentChallenge.id}/teams/${item.id}`} className="blue-text" target="_blank">
            Voir l'équipe dans "{currentChallenge.name}"
          </Link>
        )}
      </h6>
    </li>
  )
}

export default Club
