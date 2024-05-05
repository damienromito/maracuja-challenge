import { TeamScoresDetail } from "@maracuja/shared/components"
import { USER_ROLES } from "@maracuja/shared/constants"
import React from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { RegularLink, TeamCell } from "../../components"
import { ROUTES } from "../../constants"
import { useApp, useAuthUser, useCurrentChallenge } from "../../contexts"

const focusOverRank = 3
const focusUnderRank = 8

const Ranking = ({ ranking, phase, isFocus = true, onClickUnFocus = undefined }) => {
  const { currentTeam, currentChallenge } = useCurrentChallenge()

  const rank = ranking.teams ? ranking.teams.findIndex((item) => item.id === currentTeam.id) : null

  const { openPopup } = useApp()
  const history = useHistory()
  const { authUser } = useAuthUser()
  const handleClickCell = (team) => {
    if (currentTeam.id === team.id) {
      history.push(ROUTES.ACTIVE_CLUB)
    } else if (authUser.hasRole(USER_ROLES.SUPER_ADMIN)) {
      history.push(`/challenge/club/${team.id}`)
    } else if (phase && !currentChallenge.topPlayersEnabled) {
      openPopup({
        title: team.name,
        message: "",
        buttonText: "Ok",
        children: <TeamScoresDetail phase={phase} team={team} isRankingScore={true} />,
      })
    }
  }

  // currentTeam.id = 'esb3_esb'

  return (
    <div className="ranking">
      {isFocus && rank > focusOverRank + 1 && (
        <RegularLink className="unfocus" onClick={onClickUnFocus}>
          Voir tous les clubs
        </RegularLink>
      )}

      {!ranking.teams?.length ? (
        <p style={{ textAlign: "center", margin: "30px 16px" }}>
          Toutes les {currentChallenge.wording.tribes} sont encore aux vestiaires...
        </p>
      ) : (
        <>
          {ranking.teams.map((item, index) => {
            if (isFocus && (index < rank - focusOverRank || index > rank + focusUnderRank)) {
              return null
            } else {
              // if (!(item.id === MARACUJA_TEAM_ID && !currentChallenge.ranking.displayMaracujaTeam)) {
              return <TeamCell key={item.id} team={item} rank={index + 1} phase={phase} onClickCell={handleClickCell} />
            }
          })}
          {isFocus && focusUnderRank + rank < ranking.teams.length && (
            <RegularLink className="unfocus" onClick={onClickUnFocus}>
              Voir tous les clubs
            </RegularLink>
          )}
        </>
      )}
    </div>
  )
}

export default Ranking
