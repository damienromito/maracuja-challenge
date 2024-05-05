import { FieldArray } from "formik"
import React, { useMemo } from "react"
import styled from "styled-components"
import FieldContainer from "../../FormikFieldContainer"
import QuestionForm from "./QuestionForm"
import ChoiceCountMaxField from "./ChoiceCountMaxField"
import FormButton from "../../FormButton"
import { useCurrentChallenge, useCurrentOrganisation } from "@maracuja/shared/contexts"
import CropImageField from "../../CropImageField"

export default ({ onEditQuestion, currentQuestion }) => {
  const { currentChallenge } = useCurrentChallenge()
  const { currentOrganisation } = useCurrentOrganisation()

  const handleChangeChoicePairing = (e, setFieldValue, index, subChoiceIndex, values) => {
    const choiceValue = e.target.value
    setFieldValue(`choices[${index}][${subChoiceIndex}]`, choiceValue)
  }

  const onSubmit = (values) => {
    const newValues = { ...values }

    if (newValues.choices) {
      const newChoices = []
      for (let i = 0; i < newValues.choices.length; i++) {
        const newSubChoices = []
        for (let j = 0; j < newValues.choices[i].length; j++) {
          newSubChoices.push(newValues.choices[i][j])
          if (j === newValues.choices[i].length - 1) {
            newChoices.push(newSubChoices.join(";"))
          }
        }
      }
      newValues.choices = newChoices.join("|")
    }
    onEditQuestion(newValues)
  }

  const initValues = useMemo(() => {
    const choicesPairing = []
    if (currentQuestion.choices) {
      const choicesPair = currentQuestion.choices.split("|", currentQuestion.choices.length)
      let i = 0
      choicesPair.forEach((choice) => {
        choicesPairing[i] = choice.split(";", choice.length)
        i++
      })
    }

    const values = {
      choices: currentQuestion.choices && currentQuestion.choices.length > 1 ? choicesPairing : [""],
      choiceCount: currentQuestion.choiceCount || (currentChallenge?.quiz.displayAMaxOfChoices ? 3 : 0),
      image: currentQuestion.image || "",
    }
    return values
  }, [currentQuestion])

  return (
    <QuestionForm onSubmit={onSubmit} currentQuestion={currentQuestion} initialValues={initValues}>
      {(props) => {
        const { errors, touched, values, setFieldValue } = props
        return (
          <>
            <HeaderResponse>
              <span className="header-text">Réponses (par paires)</span>
              <ChoiceCountMaxField {...props} currentQuestion={currentQuestion} />
            </HeaderResponse>
            {/* @ts-ignore */}
            <FieldArray name="choices">
              {(arrayHelpers) => {
                const choices = values.choices
                return (
                  <>
                    {choices
                      ? choices.map((choice, i) => (
                          <ChoicePairing key={i}>
                            <div className="field-container">
                              <FieldContainer
                                errors={errors}
                                touched={touched}
                                index={i}
                                name={`choices[${i}][0]`}
                                type="text"
                                placeholder="Entre une réponse"
                                onChange={(e) => handleChangeChoicePairing(e, setFieldValue, i, 0, values)}
                              />
                            </div>
                            <div className="field-container">
                              <FieldContainer
                                errors={errors}
                                touched={touched}
                                index={i}
                                name={`choices[${i}][1]`}
                                type="text"
                                placeholder="Entre une réponse"
                                onChange={(e) => handleChangeChoicePairing(e, setFieldValue, i, 1, values)}
                              />
                            </div>
                            <DeleteButton type="button" onClick={() => arrayHelpers.remove(i)}>
                              <i className="material-icons">delete</i>
                            </DeleteButton>
                          </ChoicePairing>
                        ))
                      : null}
                    <FormButton style={{ margin: "16px 0" }} onClick={() => arrayHelpers.insert(choices.length, "")}>
                      Ajouter un choix
                    </FormButton>
                  </>
                )
              }}
            </FieldArray>
            <CropImageField
              name="image"
              imageName={`${currentQuestion.id}`}
              folderName={`organisations/${currentOrganisation.id}/content`}
              sizePreview={{ width: 100, height: (300 / 500) * 100 }}
              size={{ width: 500, height: 300 }}
            />
          </>
        )
      }}
    </QuestionForm>
  )
}

const ChoicePairing = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
  margin-top: 4px;

  .field-container {
    flex-grow: 1;
  }

  .input-field {
    margin: 0 10px 0 0;
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

const HeaderResponse = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 16px;

  .header-text {
    font-weight: 500;
    font-size: 15px;
    line-height: 18px;
  }

  .choice-count-container {
    align-items: center;
    display: flex;
    height: 36px;
    justify-content: center;
    width: 202px;

    label {
      color: black;
      font-family: "Open Sans";
      font-size: 11px;
      line-height: 15px;
      margin-right: 4px;
      text-align: right;
    }

    select {
      height: 36px;
      width: 202px;
    }
  }
`
