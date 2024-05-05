import React from "react"

import { Field } from "formik"

// interface CheckboxFieldProps {
//   label?: string
//   name?: string
//   style?: any
// }
export default (props: any) => {
  return (
    <label>
      <Field style={{ position: "relative" }} type="checkbox" {...props} />
      <span> {props.label}</span>
    </label>
  )
}
