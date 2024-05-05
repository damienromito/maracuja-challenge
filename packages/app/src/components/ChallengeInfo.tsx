import React from "react"
import styled from "styled-components"
import Title4 from "./Title4"
import Title3 from "./Title3"
import Title2 from "./Title2"
import TitleDate from "./TitleDate"
import ChallengeAvatar from "./ChallengeAvatar"

interface ChallengeInfoProps {
  challenge: any
  small?: boolean
  large?: boolean
}
export default ({ challenge, small, large }: ChallengeInfoProps) => {
  return (
    <Container className="challenge-icon">
      <ChallengeAvatar challenge={challenge} size={small ? "130px" : "25vh"} />
      {small ? (
        <Title4>{challenge.name}</Title4>
      ) : large ? (
        <Title2>{challenge.name}</Title2>
      ) : (
        <Title3>{challenge.name}</Title3>
      )}
      <TitleDate>{challenge.periodString}</TitleDate>
    </Container>
  )
}

const Container = styled.div`
  margin-bottom: 15px;
  padding-left: 10%;
  padding-right: 10%;
  text-align: center;
  .title-date {
    color: ${(props) => props.theme.text.tertiary};
    margin-top: 5px;
  }
`
