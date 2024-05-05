
import React from 'react'
import styled from 'styled-components'

const TestInfoContainer = styled.span`
  position:fixed;
  top:0;
  width:100%;
  z-index: 11;
  color:red;
`

const TestInfo = ({ testMode, question }) => {
  return testMode && question
    ? <TestInfoContainer>{question.id} - level {question.level || '-'}</TestInfoContainer>
    : null
}

export default TestInfo
