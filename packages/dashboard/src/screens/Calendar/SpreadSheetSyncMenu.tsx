import { ACTIVITY_TYPES } from "@maracuja/shared/constants"
import { useAuthUser, useCurrentChallenge } from "@maracuja/shared/contexts"
import M from "materialize-css"
import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { USER_ROLES } from "../../constants"
import Gss, { exportToGssDoc, importFromGssDoc } from "../../utils/gssManager"

export default ({ onFetchQuestionSets = null, onSaveQuestionSet = null, sheetUrl = null, disabled = false }) => {
  const { authUser } = useAuthUser()
  const { currentChallenge } = useCurrentChallenge()
  const [loading, setLoading] = useState<any>(false)
  const { organisationId } = useParams<any>()

  const handleImportQuestions = async () => {
    setLoading(true)

    if (sheetUrl) {
      Gss(sheetUrl).then(async (gssResult) => {
        const gssDoc = gssResult.gssDoc
        const questionSets = await onFetchQuestionSets()
        const params = [
          "id",
          "type",
          "text",
          "choices",
          "content",
          "solutions",
          "choiceCount",
          "image",
          "mediaIsVideo",
          "video",
          "level",
          "copyright",
          "level",
          "textNegative",
          "comment",
          "validated",
          "commentClient",
          "validatedClient",
          "themeId",
          "createdAt",
          "editedAt",
          "hasChallengeVariation",
        ]
        const promises = []
        questionSets.forEach((questionSet) => {
          const questionsData = []
          importFromGssDoc(gssDoc, questionSet.id).then((records: any) => {
            if (!records) {
              questionsData.push({})
              return
            }

            records.forEach((record) => {
              let newQuestion: any = {}
              params.forEach((param) => {
                let value = record[param]
                if (value) {
                  if (param === "createdAt" || param === "editedAt") {
                    value = new Date(value)
                  }
                  if (value === "TRUE") value = true
                  newQuestion[param] = value
                }
              })

              if (newQuestion.hasChallengeVariation) {
                const oldQuestion = questionSet.questions.find((q) => q.id === record.id)
                if (oldQuestion) {
                  newQuestion = { ...oldQuestion }
                }
              }
              if (newQuestion.id) {
                questionsData.push(newQuestion)
              }
            })

            if (records || questionSet.questions.length) {
              const importPromise = onSaveQuestionSet({
                questionSet,
                questionsToUpdate: questionsData,
              })
              promises.push(importPromise)
            }
          })
        })

        await Promise.all(promises)
        setLoading(false)
      })
    } else {
      window.alert("Les id google spread sheet du challenge sont invalides")
      setLoading(false)
      return false
    }
  }

  const handleExportQuestions = async () => {
    setLoading(true)
    if (!sheetUrl) {
      window.alert("Les id google spread sheet du challenge sont invalides")
      setLoading(false)
      return false
    }

    const gssResult = await Gss(sheetUrl)
    const gssDoc = gssResult.gssDoc
    const questions = []
    const questionSets = await onFetchQuestionSets()

    let questionCount = 0
    questionSets.forEach((questionSet) => {
      const questionDefault = {
        // phaseId: questionSet.phaseId,
        // phaseName: questionSet.phase.name,
        questionSetId: questionSet.id,
        disabled: questionSet.disabled,
        module: questionSet.module?.name,
        questionSetName: questionSet.name,
        questionSetType: questionSet.type === ACTIVITY_TYPES.TRAINING ? "Entrainement" : "Épreuve",
      }
      if (!questionSet.questions || questionSet.questions.length === 0) {
        questions.push({ ...questionDefault })
      } else {
        questionSet.questions.forEach((question) => {
          Object.keys(question).forEach((key) => {
            const property = question[key]

            if (typeof property === "boolean") {
              question[key] = property ? "TRUE" : null
            }
          })
          question = {
            ...question,
            ...questionDefault,
          }
          questions.push(question)
        })
        questionCount += questionSet.questions.length
      }
    })

    const headerValues = [
      "id",
      "type",
      "disabled",
      "phaseName",
      "questionSetName",
      "questionSetType",
      "text",
      "textNegative",
      "choices",
      "solutions",
      "choiceCount",
      "content",
      "image",
      "mediaIsVideo",
      "video",
      "copyright",
      "level",
      "comment",
      "validated",
      "commentClient",
      "validatedClient",
      "phaseId",
      "questionSetId",
      "themeId",
      "module",
      "createdAt",
      "editedAt",
      "hasChallengeVariation",
    ]

    exportToGssDoc(gssDoc, questions, headerValues)
      .then(() => {
        M.toast({ html: questionCount + " questions exportées !" })
      })
      .catch((error) => {
        setLoading(false)
      })
    setLoading(false)
  }

  return (
    <>
      {loading && (
        <div className="progress">
          <div className="indeterminate" />
        </div>
      )}
      {authUser.hasRole(USER_ROLES.SUPER_ADMIN) && (
        <p className="right">
          <button
            className="btn-small  red darken-4 white-text"
            onClick={() => handleImportQuestions()}
            disabled={disabled}
          >
            <i className="left material-icons">cloud_download</i>
            IMPORTER LES QUESTIONS
          </button>
          -
          {(organisationId || currentChallenge.isTemplate) && (
            <button
              className="btn-small  red darken-4 white-text"
              style={{ marginRight: "10px" }}
              onClick={() => handleExportQuestions()}
              disabled={disabled}
            >
              <i className="left material-icons">cloud_upload</i>
              EXPORTER LES QUESTIONS
            </button>
          )}
          <br />
          <a href={sheetUrl} target="_blank" rel="noreferrer">
            Aller au SpreadSheet
          </a>
        </p>
      )}
    </>
  )
}
