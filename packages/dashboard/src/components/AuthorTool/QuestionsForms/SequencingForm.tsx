import { useCurrentOrganisation } from "@maracuja/shared/contexts"
import { FieldArray } from "formik"
import { useMemo } from "react"
import styled from "styled-components"
import CropImageField from "../../CropImageField"
import FormButton from "../../FormButton"
import FieldContainer from "../../FormikFieldContainer"
import QuestionForm from "./QuestionForm"

export default ({ onEditQuestion, currentQuestion }) => {
  const { currentOrganisation } = useCurrentOrganisation()

  const onSubmit = (values) => {
    const newValues = { ...values }
    newValues.solutions = values.solutions.join("|")
    newValues.choices = values.solutions.join("|")
    onEditQuestion(newValues)
  }

  const handleChangeSolution = (e, setFieldValue, index, values) => {
    const solutionValue = e.target.value
    setFieldValue(`solutions[${index}]`, solutionValue)
  }

  const initValues = useMemo(() => {
    const values: any = {
      image: currentQuestion.image || "",
      solutions:
        currentQuestion.solutions && currentQuestion.solutions.length > 1
          ? currentQuestion.solutions.split("|", currentQuestion.solutions.length)
          : [],
    }
    values.choices = values.solutions
    return values
  }, [currentQuestion])

  return (
    <QuestionForm onSubmit={onSubmit} currentQuestion={currentQuestion} initialValues={initValues}>
      {(props) => {
        return (
          <>
            <HeaderResponse>
              <span className="header-text">Réponses (dans le bon ordre, elles seront melangées aleatoirement)</span>
              {/* <ChoiceCountMaxField {...props} currentQuestion={currentQuestion} /> */}
            </HeaderResponse>
            {/* @ts-ignore */}
            <FieldArray name="solutions">
              {(arrayHelpers) => {
                const solutions = props.values.solutions
                return (
                  <>
                    {solutions?.map((solution, i) => (
                      <FieldArrayContainer key={i}>
                        <span className="field-container">
                          <FieldContainer
                            errors={props.errors}
                            touched={props.touched}
                            index={i}
                            name={`solutions[${i}]`}
                            type="text"
                            placeholder="Entre une réponse"
                            onChange={(e) => handleChangeSolution(e, props.setFieldValue, i, props.values)}
                          />
                        </span>
                        <DeleteButton type="button" onClick={() => arrayHelpers.remove(i)}>
                          <i className="material-icons">delete</i>
                        </DeleteButton>
                      </FieldArrayContainer>
                    ))}
                    <FormButton style={{ margin: "16px 0" }} onClick={() => arrayHelpers.insert(solutions.length, "")}>
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

const FieldArrayContainer = styled.label`
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
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
