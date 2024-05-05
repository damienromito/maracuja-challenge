import moment from "moment"
import "moment/locale/fr"
import React from "react"
import styled from "styled-components"
import { DebriefingButton, DebriefingIcon, Text3 } from "../../components"
import Text2 from "../../components/Text2"

export default ({ contest }) => {
  const progression = contest.getDebriefingProgression()
  const needToDebrief = contest.getIfDebriefingIsNeeded()

  return (
    <Wrapper>
      <DebriefingIcon progression={needToDebrief ? progression : 1.0} medium />
      <Text2> Debriefing en cours</Text2>
      {needToDebrief ? (
        <>
          <Text3 className="text-white">Epreuve debriefée à {contest.getDebriefingProgression(true)}</Text3>

          <DebriefingButton contestToDebrief={contest} />
          <Text3 className="text-tertiary">
            {contest.debriefingEndDate
              ? `Il te reste ${moment(contest.debriefingEndDate).fromNow(true)} pour revoir tes erreurs`
              : "Revois tes erreurs"}
          </Text3>
        </>
      ) : (
        <>
          <Text3 className="text-white">Tu as tout bon, pas besoin de débriefer 👏 </Text3>
        </>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: 16px;
  margin: 16px;
  background: ${(props) => props.theme.bg.secondary};
  border-radius: 8px;
  width: calc(100% - 32px);
`
