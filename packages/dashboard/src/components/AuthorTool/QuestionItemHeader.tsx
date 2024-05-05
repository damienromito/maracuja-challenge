import React from 'react'

import { QUESTION_TYPES } from '../../constants/'

const QuestionItemHeader = ({ question }) => {
  const getPicto = (questionType) => {
    if (questionType === QUESTION_TYPES.MCQTEXT) {
      return <i className='material-icons tiny '>format_list_bulleted</i>
    } else if (questionType === QUESTION_TYPES.MCQIMAGES) {
      return <i className='material-icons tiny '>photo_library</i>
    } else if (questionType === QUESTION_TYPES.SEQUENCING) {
      return <i className='material-icons tiny '>chat</i>
    } else if (questionType === QUESTION_TYPES.PAIRING) {
      return <i className='material-icons tiny '>layers</i>
    } else if (questionType === QUESTION_TYPES.CARD) {
      return <i className='material-icons tiny '>content_paste</i>
    }
  }
  return (

    <h6 className='truncate'>
      {getPicto(question.type)}
      <strong>{question.text} </strong>
         &nbsp;({question.type} - {question.id || ''} - level {question.level || ''})
    </h6>

  )
}

export default QuestionItemHeader
