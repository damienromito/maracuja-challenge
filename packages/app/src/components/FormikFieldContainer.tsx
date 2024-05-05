import React from "react"
import { Field, useFormikContext } from "formik"
import FormikErrorLabel from "./FormikErrorLabel"
import styled from "styled-components"

export default (props) => {
  const { errors, touched } = useFormikContext<any>()
  const forString = "input-" + props.name
  return (
    <Wrapper>
      <div className="input-field">
        {props.label && (
          <label htmlFor={forString} className="active">
            {props.label}
          </label>
        )}
        <Field {...props} id={forString}>
          {props.children}
        </Field>
      </div>
      <FormikErrorLabel value={props.name} errors={errors} touched={touched} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  label {
    margin: 5px;
    display: block;
  }
`
