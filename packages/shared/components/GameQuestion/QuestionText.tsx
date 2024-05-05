import React from "react"
import styled from "styled-components"

const QuestionContainer = styled.div`
  text-align: left;
  margin-bottom: 10px;
  font-weight: 600;
  line-height: 22px;
`

export default ({ children, id = "" }) => {
  return (
    <QuestionContainer id={id} className="question-text">
      <span>{children}</span>
    </QuestionContainer>
  )
}
