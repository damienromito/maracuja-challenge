import { QUESTION_TYPES_NAMES } from "@maracuja/shared/constants"
import React, { useEffect, useMemo, useState } from "react"
import { SortableContainer, SortableElement } from "react-sortable-hoc"
import styled, { css } from "styled-components"
import { getQuestionTypePicto } from "../../screens/Helpers/QuestionTypeAssets"

export default ({
  header,
  footer,
  questionSetName,
  questions,
  sortable,
  indexQuestionEdited,
  onChangeQuestionOrder,
  onSelectQuestion,
  onRemoveQuestion,
  onWantEditQuestion,
}) => {
  const [isSortable, setIsSortable] = useState<any>(null)
  useEffect(() => {
    if (sortable) {
      setIsSortable(sortable)
    }
  }, [sortable, questions])

  const typeOfList = useMemo(() => {
    if (isSortable) {
      return (
        <>
          <SortableList onSortEnd={onChangeQuestionOrder} distance={1} lockAxis="y">
            {questions.map((item, i) => (
              <SortableItem
                questionSetName={questionSetName}
                questions={questions}
                indexQuestionEdited={indexQuestionEdited}
                onSelectQuestion={onSelectQuestion}
                onRemoveQuestion={onRemoveQuestion}
                onWantEditQuestion={onWantEditQuestion}
                key={item.id + `${i}`}
                index={i}
                i={i}
                item={item}
              />
            ))}
          </SortableList>
        </>
      )
    } else {
      return null
    }
  }, [
    isSortable,
    questionSetName,
    questions,
    indexQuestionEdited,
    onChangeQuestionOrder,
    onSelectQuestion,
    onRemoveQuestion,
  ])

  return (
    <Wrapper>
      <ListHeader>{header}</ListHeader>
      {questions && typeOfList}
      {footer}
    </Wrapper>
  )
}

const SortableList: any = SortableContainer(({ children }) => <QuestionListContainer>{children}</QuestionListContainer>)

const SortableItem: any = SortableElement(
  ({ questions, indexQuestionEdited, onSelectQuestion, onRemoveQuestion, onWantEditQuestion, item, i }) => {
    return (
      <QuestionItem selected={indexQuestionEdited === i} onClick={() => onSelectQuestion(item, i)}>
        <Filters
          validated={item.validated}
          comment={item.comment}
          validatedClient={item.validatedClient}
          commentClient={item.commentClient}
        >
          <span className="challenge-badge">{QUESTION_TYPES_NAMES[item.type]}</span>

          <span className="question-count">
            {i >= 0 ? i + 1 : "#"}/{questions.length}
          </span>
        </Filters>
        <Infos>
          <span className="question-type-picto">{getQuestionTypePicto(item.type)}</span>
          <span className="question-extract">{item.text}</span>
          {!!onWantEditQuestion && (
            <button className="trash-button" onClick={() => onWantEditQuestion(item)}>
              <i className="tiny material-icons">edit</i>
            </button>
          )}
          {!!onRemoveQuestion && (
            <button className="trash-button" onClick={() => onRemoveQuestion(item)}>
              <i className="tiny material-icons">delete</i>
            </button>
          )}
        </Infos>
      </QuestionItem>
    )
  }
)

const Wrapper = styled.div`
  min-width: 220px;
  max-width: 250px;
  background: white;
  height: calc(100vh - 100px);
`

const ListHeader = styled.div`
  background-color: #d9d9d9;
  width: 100%;
  padding: 8px;
`
const QuestionListContainer = styled.ul`
  max-height: calc(100% - 136px);
  padding-bottom: 8px;
  margin: 0;
  overflow-x: hidden;
  overflow-y: scroll;
`

const QuestionItem = styled.div<{ selected: boolean }>`
  border-bottom: 1px solid #eaeaea;
  box-shadow: none;
  height: 48px;

  user-select: none;

  &:hover {
    cursor: grab;
  }

  &:active {
    cursor: grabbing;
  }

  ${(props) =>
    props.selected &&
    css`
      background-color: rgba(233, 245, 255, 1);
      list-style-type: none;
    `}
`

interface FiltersProps {
  validatedClient: any
  validated: any
  commentClient: any
  comment: any
}
const Filters = styled.div<FiltersProps>`
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex-direction: row;
  height: 20px;
  padding: 4px 4px 0px;
  width: 220px;

  .challenge-badge {
    background-color: ${(props) =>
      props.validatedClient
        ? "gray"
        : props.validated && !props.commentClient
        ? "#7CC247"
        : props.comment || props.commentClient
        ? "#F37B21"
        : "#3FA2F7"};
    border-radius: 100px;
    color: #ffffff;
    flex-grow: 0;
    font-size: 11px;
    height: 15px;
    padding: 0px 8px;
    text-align: center;
    text-transform: capitalize;
  }

  .question-set-name {
    color: #000000;
    flex-grow: 1;
    font-family: Montserrat;
    font-size: 10px;
    font-weight: 600;
    height: 16px;
    overflow: hidden;
    padding: 0px 5px;
    text-align: right;
    text-overflow: ellipsis;
    text-transform: uppercase;
    white-space: nowrap;
    /* width: 101px; */
  }

  .question-count {
    color: #666666;
    flex-grow: 0;
    font-family: "Open Sans", arial;
    font-size: 9px;
    height: 16px;
    text-align: center;
    width: 24px;
  }
`

const Infos = styled.div`
  align-items: center;
  align-self: stretch;
  display: flex;
  flex-direction: row;
  height: 24px;
  justify-content: space-around;
  margin: 0px 4px;
  padding: 4px 4px 0px;
  width: 220px;

  .question-type-picto {
    width: 17px;
  }

  .question-extract {
    font-family: "Open Sans";
    font-size: 11px;
    height: 19px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 149px;
  }

  .trash-button {
    background: none;
    border: none;
    cursor: pointer;
    height: 20px;
    margin: 6px 0px;
    width: 20px;
  }
`
