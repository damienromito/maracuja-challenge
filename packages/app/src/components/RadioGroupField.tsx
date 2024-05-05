import React from "react"
import { Field } from "formik"

import styled from "styled-components"
import FormikErrorLabel from "./FormikErrorLabel"

const Wrapper = styled.div`
  line-height: 25px;
  margin: 7px 0px 7px 10px;
  input {
    display: inline;
    margin-right: 2px;
    width: 21px;
    height: 17px;
    top: 3px;
    position: relative;
  }
  label {
    display: inline-block;
    margin-right: 10px;
  }
  a {
    text-decoration: underline;
  }
`

const RadioGroupField = (props) => {
  const { buttons, name, label, errors, touched } = props
  return (
    <Wrapper {...props} role="group">
      <span>{label} </span>
      {buttons.map((button, index) => {
        return (
          <label key={`${button.value}${index}`}>
            <Field type="radio" name={name} value={button.value} />
            {button.label}
          </label>
        )
      })}
      <FormikErrorLabel value={name} errors={errors} touched={touched} />
    </Wrapper>
  )
}
export default RadioGroupField
