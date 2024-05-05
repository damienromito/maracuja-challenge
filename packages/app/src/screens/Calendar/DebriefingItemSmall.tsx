import "moment/locale/fr"
import React from "react"
import styled from "styled-components"
import { DebriefingIcon, Text3 } from "../../components"
import { generatePath, useHistory } from "react-router-dom"
import { ROUTES } from "../../constants"
import { USER_ROLES } from "@maracuja/shared/constants"
import { useAuthUser } from "../../contexts"

export default ({ contest }) => {
  const { authUser } = useAuthUser()
  const history = useHistory()

  const progression = contest.getDebriefingProgression()

  const handleClick = () => {
    if (authUser.hasRole(USER_ROLES.ADMIN)) {
      history.push(generatePath(ROUTES.DEBRIEFING_INTRO, { questionSetId: contest.id }))
    }
  }

  return (
    <Wrapper onClick={handleClick}>
      <DebriefingIcon progression={progression} />
      <Text3 className="text-tertiary">Épreuve debriefée à {contest.getDebriefingProgression(true)}</Text3>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  justify-content: center;
  flex-direction: row;
  display: flex;
  padding: 16px;
  margin: 16px;
  background: ${(props) => props.theme.bg.secondary};
  border-radius: 8px;
  .activity-icon {
    width: 50px;
  }
`
