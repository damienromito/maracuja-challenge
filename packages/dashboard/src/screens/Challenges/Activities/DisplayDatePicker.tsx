import { useFormikContext } from "formik"
import React from "react"
import DatePicker from "react-datepicker"
import styled from "styled-components"

export default ({ label, name, showTimeSelect = true, dateFormat = "d MMMM yyyy H:mm" }) => {
  const formik = useFormikContext<any>()
  return (
    <PickDateField>
      <p>{label}</p>
      <DatePicker
        dateFormat={dateFormat}
        locale="fr"
        name={name}
        onChange={(val) => formik.setFieldValue(name, val)}
        selected={formik.values[name]}
        showTimeSelect={showTimeSelect}
        value={formik.values[name]}
      />
    </PickDateField>
  )
}

const PickDateField = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  justify-content: space-around;
  width: 100%;

  &:nth-child(n):not(:last-child) {
    margin-right: 10px;
  }
`
