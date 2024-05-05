import { Field, FieldArray } from "formik"
import React from "react"
import styled from "styled-components"
import FormButton from "../FormButton"
import FormikErrorLabel from "../FormikErrorLabel"

export default (props) => {
  const { values, setFieldValue, iterateField, solutionType, hasDefaultValues } = props

  const handleAddChoice = (arrayHelpers, choices) => {
    const defaultValue = hasDefaultValues ? String.fromCharCode(97 + choices.length).toUpperCase() : ""
    arrayHelpers.insert(choices.length, defaultValue)
  }

  return (
    <div role="group" aria-labelledby="checkbox-group">
      {/* @ts-ignore */}
      <FieldArray name="choices">
        {(arrayHelpers) => {
          const choices = values.choices
          return (
            <>
              {choices?.map((choice, index) => {
                const savedChoiceValue = solutionType === "image" ? choice[0] : choice
                return (
                  <FieldArrayContainer key={index}>
                    <label>
                      <Field type="checkbox" name="solutions" id={index} value={savedChoiceValue} />

                      <span />
                    </label>
                    <Content>{iterateField(choice, index)}</Content>
                    <DeleteButton
                      type="button"
                      onClick={() => {
                        const indexToSolution = values.solutions.indexOf(savedChoiceValue)
                        if (indexToSolution > -1) {
                          const newSolutions = [...values.solutions]
                          newSolutions.splice(indexToSolution, 1)
                          setFieldValue("solutions", newSolutions)
                        }
                        arrayHelpers.remove(index)
                      }}
                    >
                      <i className="material-icons">delete</i>
                    </DeleteButton>
                  </FieldArrayContainer>
                )
              })}
              <FormButton style={{ margin: "16px 0" }} onClick={() => handleAddChoice(arrayHelpers, choices)}>
                Ajouter un choix
              </FormButton>
            </>
          )
        }}
      </FieldArray>
      <FormikErrorLabel errors={props.errors} touched={props.touched} value="solutions" />
    </div>
  )
}

const Content = styled.div`
  flex: 1;
  overflow: hidden;
`

const FieldArrayContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 4px;

  .field-container {
    flex-grow: 1;
  }

  .field-image-container {
    flex-grow: 0;
  }

  .input-field {
    margin: 0;
    input {
      margin: 0;
    }
  }
`

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  height: 20px;
  margin: 6px 0px;
  width: 20px;
`
