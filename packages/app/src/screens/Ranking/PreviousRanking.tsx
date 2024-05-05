import { Ranking as RankingModel } from "@maracuja/shared/models"
import moment from "moment"
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { RegularLink, Text2, Text3, Title3 } from "../../components"
import { useCurrentChallenge } from "../../contexts"
import Ranking from "./Ranking"

export default () => {
  const { currentPhase, currentChallenge, currentTeam, getNextQuestionSet } = useCurrentChallenge()

  const [oldRanking, setOldRanking] = useState(null)

  const previousPhase = currentChallenge.getPreviousPhase()
  useEffect(() => {
    if (!currentPhase && previousPhase) {
      onClickLoadOldPhase()
    }
  }, [currentTeam])
  const onClickLoadOldPhase = () => {
    RankingModel.fetch({
      challengeId: currentChallenge.id,
      phase: previousPhase,
      team: currentTeam,
    }).then((ranking) => {
      setOldRanking(ranking)
    })
  }

  return (
    <>
      {previousPhase ? (
        oldRanking ? (
          <OldRanking>
            <Title3>{previousPhase.name}</Title3>
            {previousPhase.rankingFilters?.[0] && <Text2>{oldRanking[previousPhase.rankingFilters[0]]?.name}</Text2>}
            <Text3>terminé le {moment(previousPhase.endDate).format("dddd D MMM")}</Text3>
            <br />
            <Ranking isFocus={false} ranking={oldRanking} phase={previousPhase} />
          </OldRanking>
        ) : (
          <RegularLink className="unfocus" onClick={() => onClickLoadOldPhase()}>
            Voir le classement de la phase "{previousPhase.name}"
          </RegularLink>
        )
      ) : (
        currentChallenge.startDate > new Date() && (
          <p style={{ textAlign: "center", margin: "30px 16px" }}>Le challenge n'est pas encore ouvert... </p>
        )
      )}
    </>
  )
}

const OldRanking = styled.div`
  text-align: center;
  margin-top: 40px;
  .text-2 {
    color: ${(props) => props.theme.text.tertiary};
  }
`
