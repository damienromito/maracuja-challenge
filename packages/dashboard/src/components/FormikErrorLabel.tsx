import { ErrorMessage } from 'formik'
import React from 'react'
import styled from 'styled-components'

const ErrorLabel = styled.p`
  color : ${props => props.theme.text.error};
  padding: 10px 10px 4px 0px;
`

const FormikErrorLabel = ({ errors, touched, value }) => {
  if (errors && touched) {
    if (errors[value] && touched[value]) {
      return <ErrorLabel>{errors[value]}</ErrorLabel>
    } else return null
  } else return null
}

export default FormikErrorLabel
