// NOT USE
import moment from "moment"

import { PLAYER_ROLES } from "@maracuja/shared/constants"
import { useCurrentChallenge } from "@maracuja/shared/contexts"
import React from "react"
// Import the style only once in your app!
import "react-datasheet-grid/dist/style.css"
import { Link } from "react-router-dom/cjs/react-router-dom.min"

export default ({ teams, members }) => {
  const { currentChallenge } = useCurrentChallenge()

  return (
    <>
      {teams &&
        members?.map((member) => {
          const team = teams.find((t) => t.id === member.clubId)
          const isCaptain = member.roles?.includes(PLAYER_ROLES.CAPTAIN)

          return (
            <div key={member.id}>
              <Link to={`/challenges/${currentChallenge.id}/players/${member.id}`}>
                {member.firstName} {member.lastName}
                {team && <i style={{ color: team.colors?.primary || "blue" }}> {team.name || team.id} </i>}
                {isCaptain ? "✊" : ""}
              </Link>
              <span>{moment(member.subscribedAt).format("dddd D MMMM H:mm")}</span>
            </div>
          )
        })}
    </>
  )
}
