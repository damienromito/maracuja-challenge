import { Text2, Title3 } from "@maracuja/shared/components"
import React from "react"
import styled from "styled-components"
import { PhasePrizeInfo, TitleDate } from "."

const PhaseContainer = styled.div<{ showDescription: boolean }>`
  padding: 25px 15px;
  text-align: center;
  counter-increment: phase;
  background: ${(props) => props.theme.bg.tertiary};
  color: ${(props) => props.theme.text.tertiary};

  margin: 0;
  .title-date {
    color: ${(props) => props.theme.text.tertiary};
  }
  &:before {
    content: counter(phase);
    display: ${(props) => (props.showDescription ? "inline-flex" : "none")};
    background: white;
    width: 30px;
    align-self: unset;
    height: 30px;
    justify-content: center;
    color: ${(props) => props.theme.primary};
    line-height: 30px;
    border-radius: 20px;
    font-size: 20px;
    font-family: Montserrat, Verdana;
    margin-bottom: 10px;
  }
  .prized {
    color: ${(props) => props.theme.text.tertiary};
  }
`

export default ({ phase, showDescription = false }) => {
  return (
    <PhaseContainer className="item" showDescription>
      <TitleDate>
        {getDayMonth(phase.startDate)} - {getDayMonth(phase.endDate)}
      </TitleDate>
      <Title3>{phase.name}</Title3>
      <PhasePrizeInfo priceCount={phase.priceCount} isFinale={phase.isFinale} />
      {showDescription && <Text2>{phase.description}</Text2>}
    </PhaseContainer>
  )
}

const getDayMonth = (d) => {
  return d.getDate() + " " + d.toLocaleString("fr", { month: "long" })
}
