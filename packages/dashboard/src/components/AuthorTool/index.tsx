import { PlusCircleOutlined, RollbackOutlined, SaveOutlined } from "@ant-design/icons"
import { ACTIVITY_TYPES, QUESTION_TYPES, USER_ROLES } from "@maracuja/shared/constants"
import { useAuthUser, useCurrentOrganisation } from "@maracuja/shared/contexts"
import { useInterval } from "@maracuja/shared/hooks"
import { Button, Col, Divider, Row } from "antd"
import { useEffect, useReducer, useState } from "react"
import { generatePath, useHistory } from "react-router-dom"
import styled from "styled-components"
import { ROUTES } from "../../constants"
import ContentPicker from "./ContentPicker"
import ContentPreview from "./ContentPreview"
import CreateContentButton from "./CreateContentButton"
import QuestionList from "./QuestionList"
import QuestionsForm from "./QuestionsForm"
import { initialState, QuestionsReducer } from "./QuestionsReducer"
import AIGenerator from "./AIGenerator"
import { useDashboard } from "../../contexts"

export default ({
  questions,
  name,
  themeId = null,
  onSave,
  activityType = null,
  pickerEnabled,
  editionEnabled,
  questionSetInfo = null,
  quickDelete = null,
  isLibrary = false,
}) => {
  const history = useHistory()
  const { currentOrganisation } = useCurrentOrganisation()
  const { organisationSettings } = useDashboard()
  const [state, dispatch] = useReducer(QuestionsReducer, initialState)
  const [pickerOpened, setPickerOpened] = useState<any>(false)
  const [editionOpened, setEditionOpened] = useState<any>(editionEnabled && !pickerEnabled)
  const { contentList, indexQuestionEdited, isChange, currentQuestion } = state
  const { authUser } = useAuthUser()

  useInterval(() => {
    if (isChange) {
      handleSaveQuestionSet()
    }
  }, 30000)

  useEffect(() => {
    if (questions?.length) {
      dispatch({ type: "GET_QUESTION_SET", questionsData: questions })
    }
  }, [questions])

  const onNeedReload = () => {
    window.location.reload()
  }

  const handleSaveQuestionSet = async () => {
    await onSave({ questions: state.contentList })
    dispatch({ type: "SAVE_QUESTION_SET" })
  }

  const handleCancelChanges = () => {
    dispatch({ type: "CANCEL_CHANGES" })
  }

  const handleChangeQuestionOrder = ({ oldIndex, newIndex }) => {
    dispatch({
      type: "CHANGE_QUESTION_ORDER",
      oldIndex: oldIndex,
      newIndex: newIndex,
    })
  }

  const handleNewQuestion = (item) => {
    dispatch({ type: "NEW_QUESTION", item, themeId })
    setEditionOpened(true)
    setPickerOpened(false)
  }

  const handleDuplicateQuestion = () => {
    dispatch({ type: "NEW_QUESTION", duplicateCurrent: true, themeId })
  }

  const handleSelectQuestion = (item, i) => {
    // if (pickerOpened) setPickerOpened(false)
    dispatch({ type: "SELECT_QUESTION", index: i })
    const formElement = document.getElementById("content-form")
    if (formElement) {
      formElement.scrollTop = 0
    }
  }

  const handleRemoveQuestion = (item) => {
    dispatch({ type: "REMOVE_QUESTION", item: item, quickDelete })
  }

  const handleEditQuestion = (inputValues) => {
    dispatch({ type: "EDIT_QUESTION", inputValues: inputValues })
  }

  const handleWantEditQuestion = (inputValues) => {
    setEditionOpened(true)
    setPickerOpened(false)
  }

  const handleAddQuestion = ({ content, selected }) => {
    if (selected) {
      dispatch({ type: "ADD_QUESTION", content })
    } else {
      handleRemoveQuestion(content)
    }
  }

  const QuestionSetHeader = ({ children }) => {
    const cardCount = contentList?.filter((q) => q.type === QUESTION_TYPES.CARD).length || 0
    return (
      <>
        <Row>
          <Col span={15}>
            {" "}
            <h6>{name}</h6>{" "}
          </Col>
          <Col span={9}>
            <Button className="square" disabled={!isChange} onClick={handleCancelChanges} icon={<RollbackOutlined />} />
            <Button
              className="square"
              type="primary"
              disabled={!isChange}
              onClick={handleSaveQuestionSet}
              icon={<SaveOutlined />}
              danger
              style={{ marginLeft: 5 }}
            />
          </Col>
        </Row>
        <div style={{ fontSize: 10 }}>
          {(!pickerEnabled || activityType === ACTIVITY_TYPES.TRAINING) && (
            <>
              {cardCount} cartes mémos <Divider type="vertical" />
            </>
          )}
          <>{contentList?.length - cardCount || 0} contenus</>
        </div>
        {children}
      </>
    )
  }

  const handleWantPickQuestion = () => {
    setPickerOpened(true)
    setEditionOpened(false)
  }

  const handleOpenLibrary = () => {
    const currentQuestion = contentList[indexQuestionEdited]
    handleSaveQuestionSet()
    history.push(
      generatePath(ROUTES.THEME, {
        organisationId: currentOrganisation.id,
        themeId: currentQuestion.theme.id,
      })
    )
  }

  return !contentList ? null : (
    <>
      <QuestionEditor>
        {pickerOpened && <ContentPicker onSelect={handleAddQuestion} selectedIds={contentList.map((c) => c.id)} />}
        <QuestionList
          questionSetName={name}
          questions={contentList}
          sortable
          indexQuestionEdited={indexQuestionEdited}
          onChangeQuestionOrder={handleChangeQuestionOrder}
          onSelectQuestion={handleSelectQuestion}
          onRemoveQuestion={handleRemoveQuestion}
          onWantEditQuestion={handleWantEditQuestion}
          header={<QuestionSetHeader>{questionSetInfo}</QuestionSetHeader>}
          footer={
            <div style={{ padding: "0px 8px" }}>
              {editionEnabled && <CreateContentButton onAddContent={handleNewQuestion} typePrimary={!pickerEnabled} />}
              <br />
              {pickerEnabled && !pickerOpened && (
                <Button
                  type="primary"
                  style={{ marginTop: 5 }}
                  icon={<PlusCircleOutlined />}
                  onClick={handleWantPickQuestion}
                >
                  Choisir des contenus
                </Button>
              )}
            </div>
          }
        />

        {editionOpened && (
          <>
            <ContentEditor>
              {isLibrary &&
                currentQuestion &&
                (authUser.hasRole(USER_ROLES.SUPER_ADMIN) || organisationSettings.AIGenerator) &&
                currentQuestion.type === QUESTION_TYPES.CARD && (
                  <section>
                    <AIGenerator
                      currentQuestion={contentList?.[indexQuestionEdited]}
                      themeId={themeId}
                      onNeedReload={onNeedReload}
                    />
                  </section>
                )}
              <section>
                <QuestionsForm
                  currentQuestion={currentQuestion}
                  onEditQuestion={handleEditQuestion}
                  onEditOriginal={!isLibrary && handleOpenLibrary}
                  onDuplicateQuestion={handleDuplicateQuestion}
                  onRemoveQuestion={handleRemoveQuestion}
                />
              </section>
            </ContentEditor>
          </>
        )}

        <div style={{ maxWidth: 300 }}>
          <Row justify="center">
            <ContentPreview question={{ ...contentList?.[indexQuestionEdited] }} />

            {pickerEnabled && currentQuestion?.theme && (
              <>
                <Button type="primary" style={{ marginTop: 5 }} onClick={handleOpenLibrary}>
                  Modifier le contenu d'origine
                </Button>
              </>
            )}
          </Row>
        </div>
      </QuestionEditor>
    </>
  )
}

const QuestionEditor = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`

const ContentEditor = styled.div`
  flex-grow: 1;
  height: calc(100vh - 100px);
  min-width: 300px;
  overflow-y: scroll;
  gap: 16px;
  display: flex;
  flex-direction: column;
  section {
  }
`
