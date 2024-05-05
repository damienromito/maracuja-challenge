import { Field, useFormikContext } from 'formik'
import React from 'react'
import styled from 'styled-components'
import { FormikErrorLabel } from '.'

const FieldStyle = styled.div`
  .active {
    color: black;
    line-height: 2px;
  }

  .input-field {
    label{position: relative}
    input {
      background-color: white;
      border-bottom: none;
      border-radius: 6px;
      border: 1px solid #D4D4D4;
      height: 36px;
      padding: 0px 12px;
      width: calc(100% - 24px);
    }
  }
`

const FieldContainer = props => {
  const forString = 'input-' + props.name
  return (
    <>
      <FieldStyle>
        <div className='input-field browser-default'>
          <label htmlFor={forString} className='active'>{props.label}</label>
          <Field {...props} id={forString}>{props.children}</Field>
        </div>
      </FieldStyle>
      <FormikErrorLabel value={props.name} />
    </>
  )
}

export default FieldContainer
