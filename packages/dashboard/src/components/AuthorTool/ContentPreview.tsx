import { useAuthUser, useCurrentChallenge } from '@maracuja/shared/contexts'
import { useInterval } from '@maracuja/shared/hooks'
import { QuestionSet } from '@maracuja/shared/models'
import React, { useEffect, useReducer, useState } from 'react'
import { Modal } from 'react-materialize'
import { useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { FormButton, GameQuestion } from '..'
import { QUESTION_TYPES, ROUTES, USER_ROLES } from '../../constants'
import IphoneImg from '../../images/iphone.svg'
import { getQuestionTypeName, getQuestionTypePicto } from '../../screens/Helpers/QuestionTypeAssets'
import QuestionList from './QuestionList'
import QuestionsForm from './QuestionsForm'
import { initialState, QuestionsReducer } from './QuestionsReducer'

export default ({ question }) => {
  return (
    <Wrapper>
      <img className='phone' src={IphoneImg} alt='Simulateur telephone' />
      <div className='question-content'>
        {question && <GameQuestion question={question} />}
        {/* {(Object.keys(questionSet?.[indexQuestionEdited] || []).length > 1) ? (<GameQuestion question={{ ...questionSet[indexQuestionEdited] }} />) : null} */}
      </div>
    </Wrapper>
  )
}
const Wrapper = styled.div`
  flex-grow: 0;
  height: 550px;
  width: 300px;

  .phone {
    height: 550px;
    position: absolute;
    width: 300px;
  }

  .question-content {
    align-items: center;
    border-radius: 3px;
    height: 540px;
    justify-content: center;
    overflow: hidden;
    transform: scale(0.8, 0.75);
    width: 300px;
}
`
