import React from "react"
import ErrorLabel from "./ErrorLabel"
import { useFormikContext } from "formik"

const FormikErrorLabel = ({ value }) => {
  const formik = useFormikContext<any>()
  const errors = formik.errors
  const touched = formik.touched

  if (errors && touched) {
    if (errors[value] != null && touched[value]) {
      return <ErrorLabel>{errors[value]}</ErrorLabel>
    } else return null
  } else return null
}

export default FormikErrorLabel
