import { useCurrentChallenge, useCurrentOrganisation } from "@maracuja/shared/contexts"
import React, { useMemo } from "react"
import styled from "styled-components"
import CropImageField from "../../CropImageField"
import FieldContainer from "../../FormikFieldContainer"
import ChoicesFields from "../ChoicesFields"
import ChoiceCountMaxField from "./ChoiceCountMaxField"
import QuestionForm from "./QuestionForm"
import * as Yup from "yup"

export default ({ onEditQuestion, currentQuestion }) => {
  const { currentOrganisation } = useCurrentOrganisation()
  const { currentChallenge } = useCurrentChallenge()

  const onSubmit = (values) => {
    const newValues = { ...values }

    // setErrors({'solutions')
    if (newValues.choices) {
      const newChoices = []
      let newSolutions = []
      for (let i = 0; i < newValues.choices.length; i++) {
        newChoices.push(newValues.choices[i])
      }
      newValues.choices = newChoices.join("|")
      if (newValues.solutions) {
        if (newValues.solutions[0] === "") {
          newSolutions = newValues.solutions[0]
        } else {
          newSolutions = newValues.solutions.join("|")
        }
      }
      newValues.solutions = newSolutions
    }

    onEditQuestion(newValues)
  }

  const handleChangeChoice = (e, setFieldValue, index, choice, values) => {
    const choiceValue = e.target.value
    const indexToSolution = values.solutions.indexOf(choice)

    if (indexToSolution > -1) {
      const newSolutions = [...values.solutions]
      newSolutions[indexToSolution] = choiceValue
      setFieldValue("solutions", newSolutions)
    }
    setFieldValue(`choices[${index}]`, choiceValue)
  }

  const initValues = useMemo(() => {
    const values = {
      choices:
        currentQuestion.choices && currentQuestion.choices.length > 1
          ? currentQuestion.choices.split("|", currentQuestion.choices.length)
          : [""],
      choiceCount: currentQuestion.choiceCount || (currentChallenge?.quiz.displayAMaxOfChoices ? 3 : 0),
      solutions:
        currentQuestion.solutions?.length >= 1
          ? currentQuestion.solutions.split("|", currentQuestion.solutions.length)
          : [],
      image: currentQuestion.image || "",
    }

    return values
  }, [currentQuestion])
  const yupRules = {
    solutions: Yup.array().min(1, "⚠️ Entrez au moins une bonne réponse"),
  }

  return (
    <QuestionForm
      onSubmit={onSubmit}
      currentQuestion={currentQuestion}
      yupRules={yupRules}
      negativeVersion
      initialValues={initValues}
    >
      {(props) => {
        const { values, errors, touched, setFieldValue } = props
        return (
          <>
            <HeaderResponse>
              <span className="header-text">Réponses</span>
              <ChoiceCountMaxField {...props} currentQuestion={currentQuestion} />
            </HeaderResponse>
            <ChoicesFields
              {...props}
              currentQuestion={currentQuestion}
              iterateField={(choice, index) => {
                return (
                  <span className="field-container">
                    <FieldContainer
                      errors={errors}
                      touched={touched}
                      index={index}
                      name={`choices[${index}]`}
                      type="text"
                      placeholder="Entre une réponse"
                      onChange={(e) => handleChangeChoice(e, setFieldValue, index, choice, values)}
                    />
                  </span>
                )
              }}
            />
            <CropImageField
              name="image"
              imageName={`${currentQuestion.id}`}
              label="Image (format paysage 5:3)"
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
`
