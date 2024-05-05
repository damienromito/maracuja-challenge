import { useAuthUser } from "@maracuja/shared/contexts"
import React from "react"
import styled from "styled-components"
import { FormButton } from ".."
import { QUESTION_TYPES, USER_ROLES } from "../../constants"
import CardForm from "./QuestionsForms/CardForm"
import MCQImagesForm from "./QuestionsForms/MCQImagesForm"
import MCQTextForm from "./QuestionsForms/MCQTextForm"
import PairingForm from "./QuestionsForms/PairingForm"
import SequencingForm from "./QuestionsForms/SequencingForm"

export default ({ currentQuestion, onEditQuestion, onDuplicateQuestion, onRemoveQuestion, onEditOriginal }) => {
  const { authUser } = useAuthUser()

  return (
    <QuestionsFormContainer id="content-form">
      {currentQuestion && (
        <>
          {onEditOriginal && (
            <p style={{ fontSize: 12 }}>
              <strong>⚠️ La modification de ce contenu n’affectera pas le module d’origine</strong>, sinon modifiez-le
              directement <a onClick={onEditOriginal}>dans la bibliothèque.</a>{" "}
            </p>
          )}
          {currentQuestion.type === QUESTION_TYPES.MCQTEXT && (
            <MCQTextForm onEditQuestion={onEditQuestion} currentQuestion={currentQuestion} />
          )}
          {currentQuestion.type === QUESTION_TYPES.SEQUENCING && (
            <SequencingForm onEditQuestion={onEditQuestion} currentQuestion={currentQuestion} />
          )}
          {currentQuestion.type === QUESTION_TYPES.MCQIMAGES && (
            <MCQImagesForm onEditQuestion={onEditQuestion} currentQuestion={currentQuestion} />
          )}
          {currentQuestion.type === QUESTION_TYPES.PAIRING && (
            <PairingForm onEditQuestion={onEditQuestion} currentQuestion={currentQuestion} />
          )}
          {currentQuestion.type === QUESTION_TYPES.CARD && (
            <CardForm onEditQuestion={onEditQuestion} currentQuestion={currentQuestion} />
          )}

          <FormButton style={{ marginRight: "15px" }} onClick={() => onRemoveQuestion(currentQuestion)}>
            Supprimer
          </FormButton>
          <FormButton onClick={() => onDuplicateQuestion(currentQuestion.type)}>Dupliquer</FormButton>
          {authUser.hasRole(USER_ROLES.SUPER_ADMIN) && (
            <p style={{ color: "gray", fontSize: 12 }}>ID {currentQuestion.id}</p>
          )}
        </>
      )}
    </QuestionsFormContainer>
  )
}

const QuestionsFormContainer = styled.div`
  background-color: #d9d9d9;
  padding: 16px;

  /* background-color: #d9d9d9;
  flex-grow: 1;
  height: calc(100vh - 100px);
  min-width: 300px;
  overflow-y: scroll;
  padding: 16px; */
`
