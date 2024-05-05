import React from 'react'
import { Field } from 'formik'

import { styled } from '../styles'

const CheckboxContainer = styled.div`
  line-height: 25px;
  margin: 7px 0px 7px 10px;
  input {
    display:inline;
    margin-right:6px;
    width: 21px;
    height: 17px;
    top: 4px;
    position: relative;
  }
  label {
    display: inline;
    margin-right: 10px;
  }
  a{
    text-decoration: underline
  }
`

const CheckboxField = (props) => {
  return (
    <CheckboxContainer {...props}>
      <Field id={props.name} type='checkbox' name={props.name} />
      <label htmlFor={props.name}>{props.label}</label>
    </CheckboxContainer>
  )
}
export default CheckboxField
