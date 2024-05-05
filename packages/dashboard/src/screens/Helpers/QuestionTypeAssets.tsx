import React from 'react'
import { QUESTION_TYPES } from '../../constants/'

export const getQuestionTypePicto = (questionType) => {
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

export const getQuestionTypeName = (questionType) => {
  if (questionType === QUESTION_TYPES.MCQTEXT) {
    return 'QCM'
  } else if (questionType === QUESTION_TYPES.MCQIMAGES) {
    return "QCM d'images"
  } else if (questionType === QUESTION_TYPES.SEQUENCING) {
    return 'Ordonnancement'
  } else if (questionType === QUESTION_TYPES.PAIRING) {
    return 'Appariement'
  } else if (questionType === QUESTION_TYPES.CARD) {
    return 'Carte mémo'
  }
}

export const getQuestionTypeCode = (questionType) => {
  if (questionType === QUESTION_TYPES.MCQTEXT) {
    return 'MCT'
  } else if (questionType === QUESTION_TYPES.MCQIMAGES) {
    return 'MCI'
  } else if (questionType === QUESTION_TYPES.SEQUENCING) {
    return 'SEQ'
  } else if (questionType === QUESTION_TYPES.PAIRING) {
    return 'PAR'
  } else if (questionType === QUESTION_TYPES.CARD) {
    return 'CRD'
  }
}
