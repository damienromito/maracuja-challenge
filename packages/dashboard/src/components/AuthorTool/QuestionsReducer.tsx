import arrayMove from "array-move"
import "firebase/firestore"
import { nanoid } from "nanoid"
import { getQuestionTypeCode } from "../../screens/Helpers/QuestionTypeAssets"

export const initialState = {
  originalQuestionSet: [],
  contentList: [],
  indexQuestionEdited: 0,
  isChange: false,
  item: null,
}

export const QuestionsReducer = (state: any = {}, action) => {
  switch (action.type) {
    case "GET_QUESTION_SET":
      if (action) {
        const questions = action.questionsData?.slice() || []
        return {
          ...state,
          originalQuestionSet: questions,
          contentList: questions,
          currentQuestion: questions?.[state.indexQuestionEdited],
        }
      } else {
        return { ...state }
      }

    case "SAVE_QUESTION_SET":
      return {
        ...state,
        originalQuestionSet: state.contentList.slice(),
        isChange: false,
      }

    case "CANCEL_CHANGES":
      if (window.confirm("Voulez vous vraiment annuler vos actions ?")) {
        const newQuestionSet = state.originalQuestionSet.slice()
        return {
          ...state,
          contentList: newQuestionSet,
          currentQuestion: newQuestionSet.slice()[state.indexQuestionEdited],
          isChange: false,
        }
      } else {
        return { ...state }
      }

    case "CHANGE_QUESTION_ORDER":
      if (action.oldIndex !== action.newIndex) {
        const newQuestionSet = arrayMove(state.contentList, action.oldIndex, action.newIndex)

        if (action.oldIndex === state.indexQuestionEdited && state.indexQuestionEdited >= 0) {
          return {
            ...state,
            contentList: newQuestionSet,
            indexQuestionEdited: action.newIndex,
            isChange: true,
          }
        } else {
          return {
            ...state,
            contentList: newQuestionSet,
            isChange: true,
          }
        }
      } else {
        return { ...state }
      }

    case "NEW_QUESTION": {
      let newContent
      const themeId = action.themeId
      const generateId = ({ questionType }) => {
        const questionCode = themeId ? themeId.substr(0, 2).toUpperCase() : "NC"
        const generatedId = questionCode + "_" + getQuestionTypeCode(questionType) + "_" + nanoid(8)
        return generatedId
      }
      if (action.duplicateCurrent) {
        newContent = {
          themeId,
          ...state.currentQuestion,
          id: generateId({ questionType: state.currentQuestion.type }),
        }
      } else {
        newContent = {
          type: action.item,
          themeId,
          id: generateId({ questionType: action.item }),
        }
      }

      const result = addQuestionToList({ newContent, state, isChange: false })
      return result
    }

    case "ADD_QUESTION": {
      const result = addQuestionToList({
        newContent: action.content,
        state,
        isChange: true,
      })
      return result
    }

    case "SELECT_QUESTION":
      return {
        ...state,
        currentQuestion: state.contentList.slice()[action.index],
        indexQuestionEdited: action.index,
      }

    case "REMOVE_QUESTION": {
      const remove = () => {
        const newQuestionSet = state.contentList.filter((content) => content.id !== action.item.id)
        return {
          ...state,
          contentList: newQuestionSet,
          isChange: true,
        }
      }
      if (action.quickDelete) {
        return remove()
      } else {
        if (window.confirm("Voulez vous vraiment supprimer cette question ?")) {
          return remove()
        }
      }
      return { ...state }
    }

    case "EDIT_QUESTION":
      if (action.inputValues) {
        const newValues = { ...action.inputValues }
        newValues.editedAt = new Date()

        const newQuestionSet = state.contentList.slice()
        newQuestionSet[state.indexQuestionEdited] = {
          ...newQuestionSet[state.indexQuestionEdited],
          ...newValues,
        }

        const newState = {
          ...state,
          contentList: newQuestionSet,
          isChange: true,
        }

        return newState
      } else {
        return { ...state }
      }

    default:
      return {
        ...state,
      }
  }
}

const addQuestionToList = ({ newContent = {}, state, isChange }: any) => {
  newContent.content = newContent.content ? newContent.content : ""
  newContent.createdAt = new Date()
  const newQuestionSet = state.contentList.slice()
  // newQuestionSet.push(newContent)
  const i = state.indexQuestionEdited ? state.indexQuestionEdited + 1 : 0 // || newQuestionSet.length - 1
  newQuestionSet.splice(i, 0, newContent)

  return {
    ...state,
    contentList: newQuestionSet,
    currentQuestion: newQuestionSet[i],
    indexQuestionEdited: i,
    isChange,
  }
}
