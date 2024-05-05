import { useCurrentChallenge, useCurrentOrganisation } from "@maracuja/shared/contexts"
import React, { useMemo } from "react"
import styled from "styled-components"
import CropImageField from "../../CropImageField"
import FieldContainer from "../../FormikFieldContainer"
import ChoicesFields from "../ChoicesFields"
import ChoiceCountMaxField from "./ChoiceCountMaxField"
import QuestionForm from "./QuestionForm"

export default ({ onEditQuestion, currentQuestion }) => {
  const { currentChallenge } = useCurrentChallenge()
  const { currentOrganisation } = useCurrentOrganisation()

  const onSubmit = (values) => {
    const newValues = { ...values }
    if (newValues.choices) {
      const newChoices = []
      let newSolutions = []
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
    setFieldValue(`choices[${index}][0]`, choiceValue)
  }

  const initValues = useMemo(() => {
    const choices = []
    if (currentQuestion.choices) {
      const choicesPairImg = currentQuestion.choices.split("|", currentQuestion.choices.length)
      let i = 0
      choicesPairImg.forEach((choice) => {
        choices[i] = choice.split(";", choice.length)
        i++
      })
    }

    const solutions =
      currentQuestion.solutions?.length > 0
        ? currentQuestion.solutions.split("|", currentQuestion.solutions.length)
        : []

    const choiceCount = currentQuestion.choiceCount || (currentChallenge?.quiz.displayAMaxOfChoices ? 3 : 0)

    return {
      choices,
      solutions,
      choiceCount,
    }
  }, [currentQuestion])

  return (
    <QuestionForm onSubmit={onSubmit} currentQuestion={currentQuestion} negativeVersion initialValues={initValues}>
      {(props) => {
        return (
          <>
            <HeaderResponse>
              <span className="header-text">Réponses</span>
              <ChoiceCountMaxField {...props} currentQuestion={currentQuestion} />
            </HeaderResponse>
            <ChoicesFields
              {...props}
              currentQuestion={currentQuestion}
              solutionType="image"
              hasDefaultValues={true}
              iterateField={(choice, i) => {
                return (
                  <>
                    <div className="field-image-container">
                      <CropImageField
                        name={`choices[${i}][1]`}
                        imageName={`question-${currentQuestion.id}-${i}`}
                        folderName={`organisations/${currentOrganisation.id}/content`}
                        sizePreview={{ width: 30, height: 30 }}
                        size={{ width: 500, height: 500 }}
                        inline
                      />
                    </div>
                    <span className="field-container">
                      <FieldContainer
                        errors={props.errors}
                        touched={props.touched}
                        index={i}
                        name={`choices[${i}][0]`}
                        type="text"
                        placeholder="Ajoutez un nom d'image (OBLIGATOIRE)"
                        onChange={(e) => handleChangeChoice(e, props.setFieldValue, i, choice[0], props.values)}
                      />
                    </span>
                  </>
                )
              }}
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
