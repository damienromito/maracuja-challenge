import ErrorLabel from "./ErrorLabel"

const FormikErrorLabel = ({ errors, touched, value }) => {
  if (errors && touched && errors[value] && touched[value]) {
    return <ErrorLabel>{errors[value]}</ErrorLabel>
  } else return null
}

export default FormikErrorLabel
